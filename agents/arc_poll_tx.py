"""Poll an Arc tx hash and update fhe_sync_state.json when confirmed."""
from __future__ import annotations

import json
import os
import sys
import time

from dotenv import load_dotenv
from web3 import Web3

from repo_paths import symbio_root

ARC_EXPLORER = "https://testnet.arcscan.app"
# Canteen/swarm RPC often cannot serve receipts; public Arc RPC can.
ARC_READ_RPC_DEFAULT = "https://rpc.testnet.arc.network"


def arc_read_rpc() -> str:
    return (
        os.getenv("ARC_READ_RPC")
        or os.getenv("ARC_RPC_PUBLIC")
        or ARC_READ_RPC_DEFAULT
    )


def main() -> None:
    tx_hex = sys.argv[1] if len(sys.argv) > 1 else ""
    if not tx_hex.startswith("0x"):
        print("Usage: python agents/arc_poll_tx.py 0x...")
        return

    root = symbio_root()
    load_dotenv(root / ".env")
    w3 = Web3(Web3.HTTPProvider(arc_read_rpc()))
    state_path = root / "fhe_sync_state.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))
    payment = state.get("payment") or {}
    amount = payment.get("amount", 0)
    wallet = os.getenv("WALLET_ADDRESS", "")

    for i in range(60):
        try:
            receipt = w3.eth.get_transaction_receipt(tx_hex)
            state["arc"] = {
                "status": "confirmed",
                "note": (
                    f"Public Arc settlement pulse for swarm payment "
                    f"{payment.get('tx_id', '')} (${amount} USDC nominal)."
                ),
                "public_amount_usdc": amount,
                "wallet": wallet,
                "tx_hash": tx_hex,
                "block": receipt.blockNumber,
                "explorer_tx": f"{ARC_EXPLORER}/tx/{tx_hex}",
            }
            state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")
            print(f"[arc] confirmed block {receipt.blockNumber}")
            print(state["arc"]["explorer_tx"])
            return
        except Exception:
            print(f"[arc] waiting... ({i + 1}/60)")
            time.sleep(10)

    state["arc"] = {
        "status": "submitted",
        "note": "Tx in mempool; re-run arc_poll_tx.py later.",
        "public_amount_usdc": amount,
        "wallet": wallet,
        "tx_hash": tx_hex,
        "explorer_tx": f"{ARC_EXPLORER}/tx/{tx_hex}",
    }
    state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")
    print(f"[arc] still pending: {state['arc']['explorer_tx']}")


if __name__ == "__main__":
    main()
