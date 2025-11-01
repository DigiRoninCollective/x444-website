# x444 Smart Contract & Widget Deployment Checklist

## Current Status: Pre-Deployment

The widget currently uses **placeholder code** for payments. Real blockchain integration will be activated once the smart contract is deployed.

---

## 🔗 Network: BNB Chain (Binance Smart Chain)

**Chain ID:** 56 (Mainnet) or 97 (Testnet)
**RPC URL:** https://bsc-dataseed.binance.org/
**Block Explorer:** https://bscscan.com/

---

## 📋 Deployment Steps

### Step 1: Deploy Smart Contract to BNB Chain

- [ ] Compile x444 payment contract
- [ ] Deploy to BNB Chain (testnet first recommended)
- [ ] Verify contract on BscScan
- [ ] Save contract address: `0x_______________`
- [ ] Save contract ABI JSON

**Estimated Time:** 1-2 hours
**Cost:** ~0.01 BNB for deployment gas

---

### Step 2: Configure Backend API

The widget needs a backend endpoint to facilitate gasless payments.

**Required:** `/api/pay/gasless` endpoint

**What it does:**
- Receives signed payment authorization from customer
- Verifies signature
- Submits transaction to BNB Chain (you pay gas)
- Returns transaction hash to customer

**Implementation options:**

#### Option A: Supabase Edge Function (Recommended)
```bash
# Create new function
supabase functions new pay-gasless

# Deploy
supabase functions deploy pay-gasless --project-ref bvuauqwgodbesyfswiun

# Set secrets
supabase secrets set FACILITATOR_PRIVATE_KEY=your_wallet_private_key --project-ref bvuauqwgodbesyfswiun
supabase secrets set X444_CONTRACT_ADDRESS=0xYourContractAddress --project-ref bvuauqwgodbesyfswiun
supabase secrets set BNB_RPC_URL=https://bsc-dataseed.binance.org/ --project-ref bvuauqwgodbesyfswiun
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

### Step 3: Fund Facilitator Wallet

Your facilitator wallet needs BNB to pay gas for customer transactions.

- [ ] Create dedicated facilitator wallet
- [ ] Save private key securely (environment variable)
- [ ] Fund wallet with BNB (start with 0.1 BNB for testing)

**Gas cost per transaction:** ~0.0005 BNB ($0.30 @ $600/BNB)
**Recommended balance:** 0.5-1 BNB (covers ~1000-2000 transactions)

---

### Step 4: Update Widget Configuration

Once contract is deployed and backend is ready, update widget.js:

```javascript
// Replace placeholder code in public/widget.js (lines 224-231)

// Import the gasless payment client
import { customerGaslessPaymentFlow } from './gasless/GaslessPaymentClient';

// In processPayment function:
const result = await customerGaslessPaymentFlow(
  signer,
  paymentLink.id,
  token,
  amount,
  '0xYOUR_CONTRACT_ADDRESS', // Your deployed contract
  56, // BNB Chain ID (56 = mainnet, 97 = testnet)
  'https://bvuauqwgodbesyfswiun.supabase.co/functions/v1' // Your API endpoint
);

if (result.success) {
  this.showStatus(statusEl, result.message, 'success');
  if (config.onSuccess) {
    config.onSuccess(result.transactionUrl, amount, token);
  }
} else {
  throw new Error(result.message);
}
```

**File to modify:** `public/widget.js` (lines 208-244)

**Estimated Time:** 30 minutes

---

### Step 5: Test on BNB Testnet

Before going live on mainnet, test everything on BNB testnet.

- [ ] Get testnet BNB from faucet: https://testnet.binance.org/faucet-smart
- [ ] Deploy contract to testnet (Chain ID 97)
- [ ] Configure widget for testnet
- [ ] Make test payment with MetaMask on testnet
- [ ] Verify transaction on https://testnet.bscscan.com/

**Estimated Time:** 1-2 hours

---

### Step 6: Deploy to BNB Mainnet

Once testnet works perfectly:

- [ ] Deploy contract to BNB mainnet (Chain ID 56)
- [ ] Update widget configuration to mainnet
- [ ] Update backend API to use mainnet RPC
- [ ] Fund facilitator wallet with mainnet BNB
- [ ] Make first real payment (small amount)
- [ ] Verify on BscScan
- [ ] Monitor for 24h before promoting

**Estimated Time:** 1 hour
**Cost:** Contract deployment + initial BNB funding

---

## 🔧 Environment Variables Needed

**Frontend (.env):**
```bash
VITE_X444_CONTRACT_ADDRESS=0xYourContractAddress
VITE_BNB_CHAIN_ID=56
VITE_API_ENDPOINT=https://bvuauqwgodbesyfswiun.supabase.co/functions/v1
```

**Backend (Supabase Secrets or Render):**
```bash
FACILITATOR_PRIVATE_KEY=your_private_key_here
X444_CONTRACT_ADDRESS=0xYourContractAddress
BNB_RPC_URL=https://bsc-dataseed.binance.org/
X444_CONTRACT_ABI={"abi":[...]}
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

## 💰 Cost Breakdown

**One-time costs:**
- Contract deployment: ~0.01 BNB ($6)
- Contract audit (optional): $5,000-$50,000

**Recurring costs:**
- Gas per transaction: ~0.0005 BNB ($0.30)
- Backend hosting: Free (Supabase/Render free tier)
- RPC costs: Free (public RPCs)

**Revenue:**
- 1% operator fee per transaction
- Break-even: ~300 transactions
- Profit margin: >90% after break-even

---

## 📚 Resources

**BNB Chain Docs:**
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
