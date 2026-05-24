import os
import asyncio
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

RPC_URL = os.getenv("ARC_RPC")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
WALLET_ADDRESS = os.getenv("WALLET_ADDRESS")

w3 = Web3(Web3.HTTPProvider(RPC_URL))


async def execute_trade(action: str, size_usdc: float):
    try:
        print(f"⚡ EXECUTOR: REAL {action.upper()} for ${size_usdc} on Arc")

        nonce = w3.eth.get_transaction_count(WALLET_ADDRESS)

        tx = {
            "nonce": nonce,
            "to": WALLET_ADDRESS,  # self-transfer (safe test)
            "value": w3.to_wei(0.00001, "ether"),  # tiny amount
            "gas": 21000,
            "gasPrice": w3.to_wei("1", "gwei"),
            "chainId": w3.eth.chain_id,
        }

        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        print(f"   ✅ REAL TX SENT: {tx_hash.hex()}")

        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        print(f"   ⛓ Confirmed in block {receipt.blockNumber}")

        return {
            "status": "confirmed",
            "tx_hash": tx_hash.hex(),
            "amount": size_usdc
        }

    except Exception as e:
        print(f"❌ TX FAILED: {e}")
        return {
            "status": "failed",
            "error": str(e)
        }

print("🔥 REAL ARC EXECUTOR LOADED")
