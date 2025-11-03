/**
 * X444 Gasless Payment Client
 *
 * This handles the CUSTOMER side of gasless payments:
 * 1. Customer creates authorization message
 * 2. Customer signs it (costs ZERO gas)
 * 3. Customer sends signature to your backend/facilitator
 * 4. You submit it on-chain
 * 5. Payment happens, customer paid ZERO gas ✅
 */

import { ethers } from 'ethers';

interface GaslessPaymentParams {
  linkId: string;
  paymentToken: string;
  amount: string | number;
  payer: string;
  deadline: number;
  contractAddress: string;
  chainId: number;
}

interface SignedAuthorization {
  linkId: string;
  paymentToken: string;
  amount: string;
  payer: string;
  deadline: number;
  signature: {
    v: number;
    r: string;
    s: string;
  };
  messageHash: string;
  signerAddress: string;
}

/**
 * Create a gasless payment authorization that customer can sign
 * This does NOT cost any gas, customer just signs offline
 */
export async function createGaslessPaymentAuthorization(
  signer: ethers.Signer,
  params: GaslessPaymentParams
): Promise<SignedAuthorization> {
  // Construct the exact message that was signed
  // Use AbiCoder to encode parameters like solidityKeccak256
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const encoded = abiCoder.encode(
    ['string', 'address', 'uint256', 'address', 'uint256', 'address', 'uint256'],
    [
      params.linkId,
      params.paymentToken,
      ethers.parseEther(params.amount.toString()),
      params.payer,
      params.deadline,
      params.contractAddress,
      params.chainId
    ]
  );
  const authHash = ethers.keccak256(encoded);

  // Convert to message (what ethers.js uses)
  const messageHashArray = ethers.getBytes(authHash);
  const messageHash = ethers.hashMessage(messageHashArray);

  // Sign the message (ZERO gas - this is offline)
  const signature = await signer.signMessage(messageHashArray);

  // Parse signature
  const sig = ethers.Signature.from(signature);

  // Get signer address for verification
  const signerAddress = await signer.getAddress();

  return {
    linkId: params.linkId,
    paymentToken: params.paymentToken,
    amount: ethers.parseEther(params.amount.toString()).toString(),
    payer: params.payer,
    deadline: params.deadline,
    signature: {
      v: sig.v,
      r: sig.r,
      s: sig.s
    },
    messageHash,
    signerAddress
  };
}

/**
 * Submit a gasless payment authorization to the smart contract
 * This is called by the FACILITATOR (you) who pays the gas
 * Customer already signed it and sent you the signature
 */
export async function submitGaslessPayment(
  provider: ethers.Provider,
  signer: ethers.Signer,
  contractAddress: string,
  contractABI: any,
  authorization: SignedAuthorization,
  gasLimit?: number
): Promise<ethers.ContractTransactionResponse | null> {
  // Connect to contract
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Prepare transaction
  const tx = await contract.processGaslessPayment(
    authorization.linkId,
    authorization.paymentToken,
    authorization.amount,
    authorization.payer,
    authorization.deadline,
    authorization.signature.v,
    authorization.signature.r,
    authorization.signature.s,
    {
      gasLimit: gasLimit || 300000
    }
  );

  // Return transaction response
  return tx;
}

/**
 * Customer flow (what they do)
 */
export async function customerGaslessPaymentFlow(
  signer: ethers.Signer,
  linkId: string,
  token: string,
  amount: string,
  contractAddress: string,
  chainId: number,
  apiEndpoint: string // Your backend API endpoint
): Promise<{ success: boolean; message: string; transactionUrl?: string }> {
  try {
    // Step 1: Create authorization message
    const signerAddress = await signer.getAddress();
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    const authorization = await createGaslessPaymentAuthorization(signer, {
      linkId,
      paymentToken: token,
      amount,
      payer: signerAddress,
      deadline,
      contractAddress,
      chainId
    });

    // Step 2: Send signature to your backend (NO gas needed)
    const response = await fetch(`${apiEndpoint}/api/pay/gasless`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authorization)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: 'Payment submitted gaslessly! Your transaction will be processed shortly.',
      transactionUrl: result.transactionHash
        ? `https://etherscan.io/tx/${result.transactionHash}`
        : undefined
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Facilitator/Server side (what you do in your backend)
 * This is called after customer sends you the signed authorization
 */
export class GaslessPaymentFacilitator {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private contractAddress: string;
  private contractABI: any;

  constructor(
    rpcUrl: string,
    privateKey: string, // Your private key (facilitator)
    contractAddress: string,
    contractABI: any
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contractAddress = contractAddress;
    this.contractABI = contractABI;
  }

  /**
   * Process a customer's gasless payment
   * Customer already signed, you just submit it
   */
  async processGaslessPayment(authorization: SignedAuthorization): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
    gasUsed?: string;
    operatorProfit?: string;
  }> {
    try {
      // Verify signature is valid before submitting
      const messageHashArray = ethers.getBytes(authorization.messageHash);
      const recoveredAddress = ethers.recoverAddress(messageHashArray, {
        v: authorization.signature.v,
        r: authorization.signature.r,
        s: authorization.signature.s
      });

      if (recoveredAddress.toLowerCase() !== authorization.payer.toLowerCase()) {
        return {
          success: false,
          error: 'Signature does not match payer address'
        };
      }

      // Submit the transaction
      const tx = await submitGaslessPayment(
        this.provider,
        this.signer,
        this.contractAddress,
        this.contractABI,
        authorization
      );

      if (!tx) {
        return {
          success: false,
          error: 'Failed to submit transaction'
        };
      }

      // Wait for confirmation
      const receipt = await tx.wait();

      if (!receipt) {
        return {
          success: false,
          error: 'Transaction failed'
        };
      }

      // Calculate facilitator profit
      const feePercentage = 1; // 1% operator fee
      const paymentAmount = parseFloat(authorization.amount);
      const operatorFee = paymentAmount * (feePercentage / 100);

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed?.toString(),
        operatorProfit: operatorFee.toFixed(4)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Batch process multiple gasless payments (efficient for high volume)
   */
  async processBatchGaslessPayments(authorizations: SignedAuthorization[]): Promise<{
    successful: number;
    failed: number;
    totalProfit: number;
    results: Array<{
      linkId: string;
      success: boolean;
      txHash?: string;
      error?: string;
    }>;
  }> {
    const results = [];
    let successful = 0;
    let failed = 0;
    let totalProfit = 0;

    for (const auth of authorizations) {
      const result = await this.processGaslessPayment(auth);

      results.push({
        linkId: auth.linkId,
        success: result.success,
        txHash: result.transactionHash,
        error: result.error
      });

      if (result.success) {
        successful++;
        if (result.operatorProfit) {
          totalProfit += parseFloat(result.operatorProfit);
        }
      } else {
        failed++;
      }
    }

    return {
      successful,
      failed,
      totalProfit,
      results
    };
  }
}

/**
 * Example usage:
 *
 * CUSTOMER SIDE:
 * ============
 * const provider = new ethers.BrowserProvider(window.ethereum);
 * const signer = await provider.getSigner();
 *
 * const result = await customerGaslessPaymentFlow(
 *   signer,
 *   'nft_drop_1',
 *   '0xX4_TOKEN_ADDRESS',
 *   '1.5',
 *   '0xX444_CONTRACT_ADDRESS',
 *   1, // mainnet chain ID
 *   'https://your-api.com'
 * );
 *
 * console.log(result);
 * // { success: true, message: "Payment submitted gaslessly!" }
 *
 *
 * FACILITATOR/SERVER SIDE:
 * =======================
 * import { GaslessPaymentFacilitator } from './gasless/GaslessPaymentClient';
 *
 * const facilitator = new GaslessPaymentFacilitator(
 *   'https://arbitrum-rpc.url',
 *   process.env.PRIVATE_KEY,
 *   '0xX444_CONTRACT_ADDRESS',
 *   X444_ABI
 * );
 *
 * // Receive authorization from customer API request
 * const result = await facilitator.processGaslessPayment(authorization);
 * console.log(result);
 * // { success: true, transactionHash: '0x...', operatorProfit: '0.015' }
 */

export default {
  createGaslessPaymentAuthorization,
  submitGaslessPayment,
  customerGaslessPaymentFlow,
  GaslessPaymentFacilitator
};
