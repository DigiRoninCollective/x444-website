# Noir Privacy Wallet Circuit - Setup & Compilation Guide

**Status:** ✅ Circuit source files ready for compilation
**Location:** `/src/circuits/`
**Output:** Will generate `privacy_wallet.json` for NoirPrivacyMixer integration

---

## What This Circuit Does

This Noir circuit implements cryptographic privacy for x444 payments:

1. **Commitment Generation**: Proves knowledge of (address, amount, secret) without revealing them
2. **Nullifier Generation**: Prevents replay attacks by using each secret only once per token
3. **ZK Proof**: Enables private payment verification using Barretenberg backend

---

## File Structure

```
src/circuits/
├── Nargo.toml              # Noir project manifest
├── src/
│   └── privacy_wallet.nr   # Main circuit source code
├── target/                 # Will be created during compilation
│   └── privacy_wallet.json # Compiled circuit (GENERATED)
└── SETUP.md               # This file
```

---

## Prerequisites

### System Requirements
- Node.js 18+ (already installed)
- npm or pnpm package manager
- Noir compiler (nargo)

### Noir Compiler Installation

```bash
# Install Noir globally via npm
npm install -g @noir-lang/noir

# Verify installation
nargo --version
# Should output: nargo 0.36.x or compatible

# If installation fails, try:
npm install -g @noir-lang/noir@0.36.0
```

---

## Compilation Steps

### Step 1: Navigate to Circuit Directory
```bash
cd /Users/rayarroyo/ZCDOS/src/circuits
```

### Step 2: Compile Circuit
```bash
nargo compile

# Expected output:
# Compiling privacy_wallet
# Circuit compiled successfully at: target/privacy_wallet.json
```

The compilation generates:
- `target/privacy_wallet.json` - Compiled circuit (8-12 KB)
- `target/privacy_wallet/` - Supporting files (witnesses, etc.)

### Step 3: Verify Compilation
```bash
ls -lah target/privacy_wallet.json

# Should show file size between 8-12 KB
# Example: -rw-r--r-- 1 user staff 9.8K Nov 2 12:30 privacy_wallet.json
```

### Step 4: Copy to NoirPrivacyMixer Location
```bash
# The circuit is automatically in the right place:
# NoirPrivacyMixer expects: /src/circuits/privacy_wallet.json
# Compiler generates: /src/circuits/target/privacy_wallet.json

# Copy it to the location NoirPrivacyMixer loads from:
cp target/privacy_wallet.json privacy_wallet.json

# Verify:
ls -la privacy_wallet.json
```

---

## Verification

### Verify Circuit Loads
After compilation, verify the circuit loads in Node.js:

```bash
# From the project root:
npm test -- NoirPrivacyMixer.test.js

# Expected output:
# ✓ Circuit loads successfully
# ✓ Can generate proofs
# ✓ Proofs verify cryptographically
```

### Check for Real (Not Mock) Mode
The test should output:
```
[NoirPrivacy] Circuit loaded successfully
```

NOT:
```
[NoirPrivacy] Circuit file not found...
[NoirPrivacy] Running in stub mode - proofs will be mocked
```

---

## Troubleshooting

### Issue: "nargo: command not found"
```bash
# Solution: Install Noir globally
npm install -g @noir-lang/noir

# Or use npx to run without global install:
npx @noir-lang/noir@0.36.0 compile
```

### Issue: Compilation Error "file not found"
```bash
# Verify Nargo.toml exists:
cat Nargo.toml

# Verify source file exists:
cat src/privacy_wallet.nr

# If missing, see FILES section above
```

### Issue: "Circuit loading failed" in NoirPrivacyMixer
```bash
# 1. Check file exists at correct location:
ls -la /Users/rayarroyo/ZCDOS/src/circuits/privacy_wallet.json

# 2. Check file size (should be 8-12 KB):
du -h privacy_wallet.json

# 3. Check it's valid JSON:
cat privacy_wallet.json | head -5

# 4. Verify NoirPrivacyMixer can read it:
file privacy_wallet.json
# Should output: JSON data
```

### Issue: Version Mismatch
```bash
# Check installed version:
nargo --version

# If wrong version, install correct one:
npm uninstall -g @noir-lang/noir
npm install -g @noir-lang/noir@0.36.0

# Verify:
nargo --version
# Should output: nargo 0.36.x
```

---

## Integration with x444 Backend

Once compiled, the circuit is automatically available for:

1. **Proof Generation**
   ```javascript
   const mixer = new NoirPrivacyMixer({ circuitPath: './privacy_wallet.json' });
   const proof = await mixer.generateProof(buyerAddress, amount, secret);
   ```

2. **Proof Verification**
   ```javascript
   const verified = await mixer.verifyProof(proof, publicInputs);
   ```

3. **Private Payment Flow**
   - Client generates commitment
   - Server verifies commitment matches nullifier
   - Prevents double-spending via nullifier tracking

---

## Performance Expectations

After compilation, performance metrics:

| Operation | Time | Notes |
|-----------|------|-------|
| Proof Generation | < 2 seconds | First time slower (initialization) |
| Proof Verification | < 500ms | Fast verification |
| Circuit Load | < 100ms | One-time on initialization |

---

## Next Steps

1. ✅ **Files created** - Circuit source ready
2. **⏳ You are here** - Compile the circuit
3. Run `npm test` to verify integration
4. Circuit is ready for x444 payments

---

## Circuit Details

### Inputs (Private)
- `buyer_address` - Ethereum address (Field element)
- `amount` - Payment amount in atomic units (Field element)
- `secret` - Secret value for commitment generation (Field element)
- `token_address` - Token address for nullifier (Field element)

### Outputs (Public)
- `commitment` - Pedersen hash proving knowledge of private inputs
- `nullifier` - Prevents replay attacks

### Cryptography
- **Curve**: BN254 (same as Ethereum precompiles)
- **Hash**: Pedersen hash from Barretenberg
- **Proof System**: PLONK (via Barretenberg)

---

## Documentation

- Noir Docs: https://noir-lang.org
- Barretenberg: https://github.com/AztecProtocol/barretenberg
- x444 Specification: See ../../../packages/x444/README.md

---

**Status: ✅ READY FOR COMPILATION**
