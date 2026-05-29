# SymbioMarket — FHE contracts (Phase 1b)

Minimal **FHECounter** on Ethereum Sepolia (Zama fhEVM). No Arc yet — that comes in Phase 2.

## Prerequisites

- Node.js 20+
- Sepolia ETH on your deployer wallet ([Sepolia faucet](https://sepoliafaucet.com/))
- `npm run fhe` already passed in `arc-nanopayments/`

## Step 1 — Install

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm install
```

Use **PowerShell** (not WSL `/mnt/c`) for Hardhat compile/deploy if you hit worker errors.

## Step 2 — Configure

```powershell
copy .env.example .env
```

Edit `.env` and set `FHE_PRIVATE_KEY` (same key as `PRIVATE_KEY` in agents is fine if it has Sepolia ETH).

## Step 3 — Compile

```powershell
npm run compile
```

## Step 4 — Deploy to Sepolia

```powershell
npm run deploy:sepolia
```

Copy the printed `FHE_COUNTER_ADDRESS` into `fhe-contracts/.env` and optionally `arc-nanopayments/.env.local`.

## Step 5 — Encrypt, increment, decrypt (full loop)

```powershell
npm run increment:sepolia
```

You should see a tx hash and `Decrypted counter value: 1` (run again → 2, etc.).

## What the contract does

- Stores an **encrypted** counter (`euint32`)
- `increment(encryptedAmount, proof)` adds homomorphically
- Only you (via Zama SDK) can decrypt the count after deployment

Next: script to encrypt → call `increment` → decrypt (we add in `arc-nanopayments/scripts/`).
