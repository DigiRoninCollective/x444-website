/**
 * X444 Payment Widget
 *
 * Drop-in payment widget for creators to embed on their websites.
 * Handles both regular and gasless payments seamlessly.
 *
 * Usage:
 * <X444PaymentWidget
 *   linkId="nft_drop_1"
 *   contractAddress="0x..."
 *   contractABI={ABI}
 *   supportedTokens={[
 *     { address: '0xX4', symbol: 'X4', name: 'X4 Token', decimals: 18 }
 *   ]}
 * />
 */

import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  customerGaslessPaymentFlow,
  GaslessPaymentFacilitator
} from '../gasless/GaslessPaymentClient';

interface SupportedToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

interface X444PaymentWidgetProps {
  linkId: string;
  contractAddress: string;
  contractABI: any;
  supportedTokens: SupportedToken[];
  facilitorApiEndpoint?: string; // For gasless payments
  onPaymentSuccess?: (transactionHash: string, amount: string) => void;
  onPaymentError?: (error: string) => void;
  theme?: 'light' | 'dark';
  isGasless?: boolean; // Enable gasless by default?
}

export const X444PaymentWidget: React.FC<X444PaymentWidgetProps> = ({
  linkId,
  contractAddress,
  contractABI,
  supportedTokens,
  faciliorApiEndpoint = 'http://localhost:3000',
  onPaymentSuccess,
  onPaymentError,
  theme = 'light',
  isGasless = true
}) => {
  // State
  const [selectedToken, setSelectedToken] = useState<SupportedToken>(supportedTokens[0]);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'gasless' | 'regular'>(isGasless ? 'gasless' : 'regular');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

  // Handle regular payment
  const handleRegularPayment = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get provider and signer
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected. Please install MetaMask.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Check balance
      const tokenContract = new ethers.Contract(
        selectedToken.address,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );

      const balance = await tokenContract.balanceOf(signerAddress);
      const amountWei = ethers.parseUnits(amount, selectedToken.decimals);

      if (balance < amountWei) {
        throw new Error(
          `Insufficient balance. You have ${ethers.formatUnits(
            balance,
            selectedToken.decimals
          )} ${selectedToken.symbol}`
        );
      }

      // Approve payment contract
      const approve = new ethers.Contract(
        selectedToken.address,
        [
          'function approve(address spender, uint256 amount) returns (bool)',
          'function allowance(address owner, address spender) view returns (uint256)'
        ],
        signer
      );

      const allowance = await approve.allowance(signerAddress, contractAddress);

      if (allowance < amountWei) {
        setError('Approving token transfer...');
        const approveTx = await approve.approve(contractAddress, amountWei);
        await approveTx.wait();
      }

      // Process payment
      const paymentContract = new ethers.Contract(contractAddress, contractABI, signer);

      setError('Processing payment...');
      const tx = await paymentContract.processPayment(
        linkId,
        selectedToken.address,
        amountWei
      );

      setError('Waiting for confirmation...');
      const receipt = await tx.wait();

      setSuccess(true);
      setTxHash(receipt.hash);
      setAmount('');
      onPaymentSuccess?.(receipt.hash, amount);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMsg);
      onPaymentError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [amount, selectedToken, linkId, contractAddress, contractABI, onPaymentSuccess, onPaymentError]);

  // Handle gasless payment
  const handleGaslessPayment = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected. Please install MetaMask.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Get network
      const network = await provider.getNetwork();

      // Check balance
      const tokenContract = new ethers.Contract(
        selectedToken.address,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );

      const balance = await tokenContract.balanceOf(signerAddress);
      const amountWei = ethers.parseUnits(amount, selectedToken.decimals);

      if (balance < amountWei) {
        throw new Error(
          `Insufficient balance. You have ${ethers.formatUnits(
            balance,
            selectedToken.decimals
          )} ${selectedToken.symbol}`
        );
      }

      setError('Signing authorization (no gas cost)...');

      // Use gasless flow
      const result = await customerGaslessPaymentFlow(
        signer,
        linkId,
        selectedToken.address,
        amount,
        contractAddress,
        Number(network.chainId),
        faciliorApiEndpoint
      );

      if (result.success) {
        setSuccess(true);
        setAmount('');
        setTxHash(result.transactionUrl || 'Pending confirmation');
        onPaymentSuccess?.(result.transactionUrl || 'gasless_payment', amount);

        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gasless payment failed';
      setError(errorMsg);
      onPaymentError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [amount, selectedToken, linkId, contractAddress, faciliorApiEndpoint, onPaymentSuccess, onPaymentError]);

  // Styles
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const borderColor = isDark ? '#333333' : '#e0e0e0';
  const successColor = '#22c55e';
  const errorColor = '#ef4444';
  const primaryColor = '#3b82f6';

  const containerStyle: React.CSSProperties = {
    maxWidth: '400px',
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: bgColor,
    border: `1px solid ${borderColor}`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: textColor
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '8px',
    color: isDark ? '#b0b0b0' : '#666666',
    textTransform: 'uppercase'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
    color: textColor,
    boxSizing: 'border-box'
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    marginBottom: '16px',
    cursor: 'pointer'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    transition: 'all 0.2s'
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: primaryColor,
    color: '#ffffff'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: `2px solid ${primaryColor}`,
    color: primaryColor
  };

  const tabs: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: `1px solid ${borderColor}`,
    paddingBottom: '12px'
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: active ? primaryColor : isDark ? '#b0b0b0' : '#666666',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    borderBottom: active ? `2px solid ${primaryColor}` : 'none',
    transition: 'color 0.2s'
  });

  const messageStyle = (type: 'error' | 'success'): React.CSSProperties => ({
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    fontSize: '13px',
    backgroundColor: type === 'error' ? `${errorColor}20` : `${successColor}20`,
    color: type === 'error' ? errorColor : successColor,
    border: `1px solid ${type === 'error' ? errorColor : successColor}`
  });

  const linkStyle: React.CSSProperties = {
    color: primaryColor,
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Pay with Memocoin</div>

      {/* Error Message */}
      {error && !loading && (
        <div style={messageStyle('error')}>{error}</div>
      )}

      {/* Success Message */}
      {success && (
        <div style={messageStyle('success')}>
          ✓ Payment successful!
          {txHash && (
            <div>
              <a href={txHash} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                View Transaction →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Payment Tabs */}
      <div style={tabs}>
        <button
          style={tabStyle(paymentType === 'gasless')}
          onClick={() => {
            setPaymentType('gasless');
            setError('');
          }}
        >
          💨 Gasless
        </button>
        <button
          style={tabStyle(paymentType === 'regular')}
          onClick={() => {
            setPaymentType('regular');
            setError('');
          }}
        >
          Standard
        </button>
      </div>

      {paymentType === 'gasless' && (
        <div style={{ fontSize: '12px', color: isDark ? '#b0b0b0' : '#666666', marginBottom: '16px' }}>
          ✓ You pay zero gas • We cover it
        </div>
      )}

      {/* Token Selector */}
      <div>
        <label style={labelStyle}>Token</label>
        <select
          value={selectedToken.address}
          onChange={(e) => {
            const token = supportedTokens.find(t => t.address === e.target.value);
            if (token) setSelectedToken(token);
          }}
          style={selectStyle}
        >
          {supportedTokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.logo ? '🪙' : ''} {token.symbol} - {token.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <div>
        <label style={labelStyle}>Amount ({selectedToken.symbol})</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
          disabled={loading}
          style={inputStyle}
          step="0.01"
          min="0"
        />
      </div>

      {/* Pay Button */}
      <button
        style={primaryButtonStyle}
        onClick={paymentType === 'gasless' ? handleGaslessPayment : handleRegularPayment}
        disabled={loading || !amount}
      >
        {loading ? (
          <span>
            {error.includes('Signing') && '✍️ Signing...'}
            {error.includes('Approving') && '⏳ Approving...'}
            {error.includes('Processing') && '⏳ Processing...'}
            {error.includes('Waiting') && '⏳ Confirming...'}
            {!error && '⏳ Processing...'}
          </span>
        ) : (
          <>
            {paymentType === 'gasless' ? '💨 Pay Gaslessly' : 'Pay Now'}
          </>
        )}
      </button>

      {/* Info Text */}
      <div style={{ fontSize: '12px', color: isDark ? '#b0b0b0' : '#666666', marginTop: '16px', lineHeight: '1.6' }}>
        {paymentType === 'gasless' ? (
          <>
            You sign once. We handle the rest.
            <br />
            <strong>Your cost: Zero gas</strong>
          </>
        ) : (
          <>
            Standard blockchain payment.
            <br />
            <strong>Your cost: Gas fee + token amount</strong>
          </>
        )}
      </div>

      {/* Powered by X444 */}
      <div style={{ fontSize: '11px', color: isDark ? '#666666' : '#999999', marginTop: '16px', textAlign: 'center' }}>
        Powered by <strong>X444</strong> • Autonomous Memocoin Payments
      </div>
    </div>
  );
};

export default X444PaymentWidget;
