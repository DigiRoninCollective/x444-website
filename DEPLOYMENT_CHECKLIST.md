# x444 Smart Contract & Widget Deployment Checklist

## Current Status: Pre-Deployment

The widget currently uses **placeholder code** for payments. Real blockchain integration will be activated once the smart contracts/programs are deployed.

---

## 🔗 Multi-Chain Support: BNB Chain + Solana

x444 will deploy on **TWO networks** to maximize reach:

### BNB Chain (EVM)
- **Chain ID:** 56 (Mainnet) or 97 (Testnet)
- **RPC URL:** https://bsc-dataseed.binance.org/
- **Block Explorer:** https://bscscan.com/
- **Wallet:** MetaMask
- **Token Standard:** BEP-20 (ERC20-compatible)
- **Gas:** Paid in BNB (~$0.30/tx)

### Solana
- **Network:** Mainnet-beta or Devnet
- **RPC URL:** https://api.mainnet-beta.solana.com
- **Block Explorer:** https://solscan.io/
- **Wallet:** Phantom
- **Token Standard:** SPL Token
- **Gas:** Paid in SOL (~$0.0001/tx - 100x cheaper!)

---

## 📋 Deployment Steps

### Step 1A: Deploy Smart Contract to BNB Chain

- [ ] Compile x444 payment contract (Solidity)
- [ ] Deploy to BNB testnet (Chain ID 97) first
- [ ] Verify contract on BscScan
- [ ] Test on testnet
- [ ] Deploy to BNB mainnet (Chain ID 56)
- [ ] Save contract address: `0x_______________`
- [ ] Save contract ABI JSON

**Estimated Time:** 1-2 hours
**Cost:** ~0.01 BNB for deployment gas (~$6)

**Tools:**
- Hardhat or Foundry for deployment
- MetaMask for signing
- BscScan API key for verification

---

### Step 1B: Deploy Program to Solana

- [ ] Build x444 payment program (Rust/Anchor)
- [ ] Deploy to Solana Devnet first
- [ ] Test on devnet
- [ ] Upgrade to Mainnet-beta
- [ ] Save program ID: `_______________`
- [ ] Save IDL JSON (Interface Definition Language)

**Estimated Time:** 2-3 hours
**Cost:** ~0.1 SOL for deployment (~$15)

**Tools:**
- Anchor framework (recommended)
- Solana CLI
- Phantom wallet for signing
- Solscan for verification

**Why Solana?**
- 100x cheaper gas fees ($0.0001 vs $0.30)
- Faster transactions (400ms vs 3 seconds)
- Better UX for high-frequency payments
- Growing memecoin ecosystem (BONK, WIF, etc.)

---

### Step 2: Configure Backend API (Multi-Chain)

The widget needs backend endpoints to facilitate gasless payments on BOTH chains.

**Required Endpoints:**
- `/api/pay/gasless/bnb` - For BNB Chain payments
- `/api/pay/gasless/solana` - For Solana payments

**What they do:**
- Receive signed payment authorization from customer
- Verify signature
- Submit transaction to blockchain (you pay gas)
- Return transaction hash to customer

**Implementation options:**

#### Option A: Supabase Edge Function (Recommended)
```bash
# Create BNB Chain function
supabase functions new pay-gasless-bnb
supabase functions deploy pay-gasless-bnb --project-ref bvuauqwgodbesyfswiun

# Create Solana function
supabase functions new pay-gasless-solana
supabase functions deploy pay-gasless-solana --project-ref bvuauqwgodbesyfswiun

# Set secrets for BNB Chain
supabase secrets set BNB_FACILITATOR_PRIVATE_KEY=your_wallet_private_key --project-ref bvuauqwgodbesyfswiun
supabase secrets set X444_BNB_CONTRACT_ADDRESS=0xYourContractAddress --project-ref bvuauqwgodbesyfswiun
supabase secrets set BNB_RPC_URL=https://bsc-dataseed.binance.org/ --project-ref bvuauqwgodbesyfswiun

# Set secrets for Solana
supabase secrets set SOLANA_FACILITATOR_PRIVATE_KEY=your_solana_private_key --project-ref bvuauqwgodbesyfswiun
supabase secrets set X444_SOLANA_PROGRAM_ID=YourProgramId --project-ref bvuauqwgodbesyfswiun
supabase secrets set SOLANA_RPC_URL=https://api.mainnet-beta.solana.com --project-ref bvuauqwgodbesyfswiun
```

#### Option B: Express.js on Render
```javascript
// In your Render backend
app.post('/api/pay/gasless', async (req, res) => {
  const facilitator = new GaslessPaymentFacilitator(
    process.env.BNB_RPC_URL,
    process.env.FACILITATOR_PRIVATE_KEY,
    process.env.X444_CONTRACT_ADDRESS,
    X444_ABI
  );

  const result = await facilitator.processGaslessPayment(req.body);
  res.json(result);
});
```

**Estimated Time:** 2-3 hours
**Cost:** Free (Supabase/Render free tier)

---

### Step 3: Fund Facilitator Wallets (Both Chains)

You need TWO facilitator wallets - one for BNB, one for Solana.

#### BNB Chain Facilitator Wallet
- [ ] Create dedicated BNB wallet (MetaMask)
- [ ] Save private key securely (environment variable)
- [ ] Fund wallet with BNB (start with 0.1 BNB for testing)

**Gas cost per transaction:** ~0.0005 BNB ($0.30)
**Recommended balance:** 0.5-1 BNB (covers ~1000-2000 transactions)

#### Solana Facilitator Wallet
- [ ] Create dedicated Solana wallet (Phantom or CLI)
- [ ] Save private key securely (environment variable)
- [ ] Fund wallet with SOL (start with 0.1 SOL for testing)

**Gas cost per transaction:** ~0.000005 SOL ($0.0001)
**Recommended balance:** 0.5-1 SOL (covers ~100,000-200,000 transactions!)

**💡 Pro Tip:** Solana is 100x cheaper! Use Solana for high-frequency/low-value payments.

---

### Step 4: Update Widget Configuration (Multi-Chain)

The widget needs to detect which wallet user has and route to the correct chain.

```javascript
// Replace placeholder code in public/widget.js

// Detect which wallet/chain to use
const detectWalletAndChain = async () => {
  // Check for Phantom (Solana)
  if (window.solana && window.solana.isPhantom) {
    return { chain: 'solana', wallet: window.solana };
  }

  // Check for MetaMask (BNB Chain)
  if (window.ethereum) {
    return { chain: 'bnb', wallet: window.ethereum };
  }

  throw new Error('No supported wallet found. Install Phantom or MetaMask.');
};

// In processPayment function:
const { chain, wallet } = await detectWalletAndChain();

if (chain === 'bnb') {
  // BNB Chain payment
  const result = await customerGaslessPaymentFlow(
    signer,
    paymentLink.id,
    token,
    amount,
    '0xYOUR_BNB_CONTRACT_ADDRESS',
    56, // BNB Chain ID
    'https://bvuauqwgodbesyfswiun.supabase.co/functions/v1/pay-gasless-bnb'
  );
} else if (chain === 'solana') {
  // Solana payment
  const result = await solanaGaslessPaymentFlow(
    wallet,
    paymentLink.id,
    token,
    amount,
    'YOUR_SOLANA_PROGRAM_ID',
    'https://bvuauqwgodbesyfswiun.supabase.co/functions/v1/pay-gasless-solana'
  );
}
```

**Files to create:**
- `src/gasless/SolanaPaymentClient.ts` - Solana version of payment client
- `public/widget.js` - Update to support multi-chain detection

**Estimated Time:** 2-3 hours

---

### Step 5: Test on Testnets

Before going live on mainnet, test everything on BOTH testnets.

#### BNB Testnet Testing
- [ ] Get testnet BNB from faucet: https://testnet.binance.org/faucet-smart
- [ ] Deploy contract to testnet (Chain ID 97)
- [ ] Configure widget for testnet
- [ ] Make test payment with MetaMask on testnet
- [ ] Verify transaction on https://testnet.bscscan.com/

#### Solana Devnet Testing
- [ ] Get devnet SOL from CLI: `solana airdrop 2`
- [ ] Deploy program to devnet
- [ ] Configure widget for devnet
- [ ] Make test payment with Phantom on devnet
- [ ] Verify transaction on https://explorer.solana.com/?cluster=devnet

**Estimated Time:** 2-3 hours (both chains)

---

### Step 6: Deploy to Mainnets

Once both testnets work perfectly:

#### BNB Mainnet Deployment
- [ ] Deploy contract to BNB mainnet (Chain ID 56)
- [ ] Update widget configuration to mainnet
- [ ] Update backend API to use mainnet RPC
- [ ] Fund facilitator wallet with mainnet BNB
- [ ] Make first real payment (small amount)
- [ ] Verify on BscScan
- [ ] Monitor for 24h before promoting

**Cost:** ~0.01 BNB deployment + 1 BNB funding = $606

#### Solana Mainnet Deployment
- [ ] Deploy program to Solana mainnet-beta
- [ ] Update widget configuration to mainnet
- [ ] Update backend API to use mainnet RPC
- [ ] Fund facilitator wallet with mainnet SOL
- [ ] Make first real payment (small amount)
- [ ] Verify on Solscan
- [ ] Monitor for 24h before promoting

**Cost:** ~0.1 SOL deployment + 1 SOL funding = $165

**Total Cost:** ~$771 for dual-chain deployment

**Estimated Time:** 2-3 hours (both chains)

---

## 🔧 Environment Variables Needed

**Frontend (.env):**
```bash
# BNB Chain
VITE_X444_BNB_CONTRACT_ADDRESS=0xYourContractAddress
VITE_BNB_CHAIN_ID=56
VITE_BNB_API_ENDPOINT=https://bvuauqwgodbesyfswiun.supabase.co/functions/v1/pay-gasless-bnb

# Solana
VITE_X444_SOLANA_PROGRAM_ID=YourProgramId
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_API_ENDPOINT=https://bvuauqwgodbesyfswiun.supabase.co/functions/v1/pay-gasless-solana
```

**Backend (Supabase Secrets):**
```bash
# BNB Chain
BNB_FACILITATOR_PRIVATE_KEY=your_bnb_private_key
X444_BNB_CONTRACT_ADDRESS=0xYourContractAddress
BNB_RPC_URL=https://bsc-dataseed.binance.org/
X444_BNB_CONTRACT_ABI={"abi":[...]}

# Solana
SOLANA_FACILITATOR_PRIVATE_KEY=[1,2,3,...] # byte array
X444_SOLANA_PROGRAM_ID=YourProgramId
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
X444_SOLANA_IDL={"version":"0.1.0",...}
```

---

## 📊 Post-Deployment Monitoring

**Monitor these metrics:**

1. **Transaction Success Rate** - Should be >95%
2. **Gas Costs** - Track BNB spent on gas
3. **Facilitator Wallet Balance** - Alert when <0.1 BNB
4. **Failed Transactions** - Investigate any failures
5. **User Complaints** - Payment not going through?

**Tools:**
- BscScan API for transaction monitoring
- Supabase logs for API errors
- Frontend error tracking (Sentry)

---

## 🚨 Security Checklist

- [ ] Facilitator private key stored in environment variable (NOT in code)
- [ ] Backend API has rate limiting (prevent spam)
- [ ] Contract has access controls (only facilitator can submit)
- [ ] Input validation on all API endpoints
- [ ] HTTPS enabled on all endpoints
- [ ] Contract audited (recommended for mainnet)

---

## 💰 Cost Breakdown (Multi-Chain)

### One-Time Costs
| Item | BNB Chain | Solana | Total |
|------|-----------|--------|-------|
| Contract/Program deployment | ~$6 | ~$15 | **$21** |
| Initial facilitator funding | ~$600 (1 BNB) | ~$150 (1 SOL) | **$750** |
| Audit (optional) | $5,000-$20,000 | $5,000-$20,000 | **$10k-$40k** |

**Total Initial Investment:** ~$771 (without audit)

### Recurring Costs (Per Transaction)

| Chain | Gas Cost | Operator Fee (1%) | Net Profit (on $10 tx) |
|-------|----------|-------------------|------------------------|
| **BNB Chain** | $0.30 | $0.10 | **-$0.20** (loss on small tx) |
| **Solana** | $0.0001 | $0.10 | **+$0.0999** (profit!) |

**Key Insight:** Solana is profitable even on $1 transactions. BNB needs >$30 transactions to be profitable.

**Recommendation:**
- Use **Solana** for: Memecoin payments, microtransactions, high-frequency trades
- Use **BNB Chain** for: Large payments, institutional, when user already has BNB

### Break-Even Analysis

**BNB Chain:**
- Need >$30/transaction to be profitable (gas = $0.30)
- Break-even: ~750 transactions @ 1% fee

**Solana:**
- Profitable at ANY amount (gas = $0.0001)
- Break-even: ~15 transactions @ 1% fee

**Revenue Projections:**
- 1,000 transactions @ $50 avg = $500 revenue - $300 gas (BNB) = **$200 profit**
- 1,000 transactions @ $50 avg = $500 revenue - $0.10 gas (Solana) = **$499.90 profit**

**Solana = 150x more profitable!** 🚀

---

## 📚 Resources

### BNB Chain Resources
**Docs:**
- https://docs.bnbchain.org/
- https://docs.bnbchain.org/docs/learn/intro

**Faucets (Testnet):**
- https://testnet.binance.org/faucet-smart

**Block Explorers:**
- Mainnet: https://bscscan.com/
- Testnet: https://testnet.bscscan.com/

**RPC Endpoints:**
- Mainnet: https://bsc-dataseed.binance.org/
- Testnet: https://data-seed-prebsc-1-s1.binance.org:8545/

### Solana Resources
**Docs:**
- https://docs.solana.com/
- https://www.anchor-lang.com/ (Anchor framework)

**Faucets (Devnet):**
- CLI: `solana airdrop 2`
- Web: https://faucet.solana.com/

**Block Explorers:**
- Mainnet: https://solscan.io/
- Devnet: https://explorer.solana.com/?cluster=devnet

**RPC Endpoints:**
- Mainnet: https://api.mainnet-beta.solana.com
- Devnet: https://api.devnet.solana.com

**Tools:**
- Anchor: `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked`
- Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
- Phantom Wallet: https://phantom.app/

---

## ✅ Current Progress

- [x] Security audit completed
- [x] Supabase Edge Functions deployed (groq-proxy, elevenlabs-proxy)
- [x] Widget UI created
- [x] Widget documentation written
- [x] GaslessPaymentClient code ready
- [ ] Smart contract deployed to BNB Chain
- [ ] Backend API endpoint created
- [ ] Widget integrated with real payments
- [ ] Tested on testnet
- [ ] Deployed to mainnet

**Next immediate step:** Deploy smart contract to BNB Chain testnet
