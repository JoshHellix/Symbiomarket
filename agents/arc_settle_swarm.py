"""

Phase 2b: Public settlement pulse on Arc testnet after FHE sync.

Updates fhe_sync_state.json with Arc tx when ARC_RPC + PRIVATE_KEY are set.



Run from repo root:

  python agents/arc_settle_swarm.py

"""

from __future__ import annotations



import json

import os

import time



from dotenv import load_dotenv



from repo_paths import symbio_root



load_dotenv(symbio_root() / ".env")

load_dotenv(symbio_root() / "agents" / ".env")



ARC_RPC = os.getenv("ARC_RPC", "https://rpc.testnet.arc.network")

ARC_READ_RPC = (

    os.getenv("ARC_READ_RPC")

    or os.getenv("ARC_RPC_PUBLIC")

    or "https://rpc.testnet.arc.network"

)

PRIVATE_KEY = os.getenv("PRIVATE_KEY") or os.getenv("FHE_PRIVATE_KEY")

WALLET_ADDRESS = os.getenv("WALLET_ADDRESS")

ARC_EXPLORER = "https://testnet.arcscan.app"





def _tx_hex(tx_hash) -> str:

    tx_hex = tx_hash.hex() if hasattr(tx_hash, "hex") else str(tx_hash)

    return tx_hex if tx_hex.startswith("0x") else "0x" + tx_hex





def _write_arc_state(state_path, state, payment, amount, wallet, arc: dict) -> None:

    state["arc"] = arc

    state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")





def _try_confirm(w3_read, tx_hash, timeout: int = 120):

    return w3_read.eth.wait_for_transaction_receipt(tx_hash, timeout=timeout)





def _build_tx(w3, wallet, nonce: int):

    tx = {

        "nonce": nonce,

        "to": wallet,

        "value": w3.to_wei(0.00001, "ether"),

        "gas": 21000,

        "chainId": w3.eth.chain_id,

    }

    try:

        latest = w3.eth.get_block("latest")

        base_fee = latest.get("baseFeePerGas")

        if base_fee is not None:

            tx["maxFeePerGas"] = int(base_fee * 2) + w3.to_wei(1, "gwei")

            tx["maxPriorityFeePerGas"] = w3.to_wei(0.1, "gwei")

        else:

            tx["gasPrice"] = w3.to_wei(1, "gwei")

    except Exception:

        tx["gasPrice"] = w3.to_wei(1, "gwei")

    return tx





def _send_settlement(w3, wallet, private_key: str):

    """Use pending nonce; retry once if RPC reports nonce too low."""

    from web3.exceptions import Web3RPCError



    for attempt in range(3):

        nonce = w3.eth.get_transaction_count(wallet, "pending")

        signed = w3.eth.account.sign_transaction(

            _build_tx(w3, wallet, nonce), private_key

        )

        try:

            tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

            return _tx_hex(tx_hash)

        except Web3RPCError as err:

            msg = str(err).lower()

            if "nonce too low" in msg and attempt < 2:

                print(f"[arc] Nonce conflict (attempt {attempt + 1}/3), refreshing pending nonce…")

                time.sleep(3)

                continue

            raise

    raise RuntimeError("Failed to broadcast Arc tx after retries")





def main() -> None:

    root = symbio_root()

    state_path = root / "fhe_sync_state.json"

    if not state_path.exists():

        print("[arc] No fhe_sync_state.json — run npm run sync:swarm first")

        return



    state = json.loads(state_path.read_text(encoding="utf-8"))

    payment = state.get("payment") or {}

    amount = payment.get("amount", 0)



    if not PRIVATE_KEY:

        _write_arc_state(

            state_path,

            state,

            payment,

            amount,

            "",

            {

                "status": "skipped_no_key",

                "note": "Set PRIVATE_KEY (or FHE_PRIVATE_KEY) and ARC_RPC in .env for Arc settlement.",

                "public_amount_usdc": amount,

            },

        )

        print("[arc] Skipped — no PRIVATE_KEY in .env")

        return



    try:

        from web3 import Web3

    except ImportError:

        _write_arc_state(

            state_path,

            state,

            payment,

            amount,

            "",

            {

                "status": "skipped_no_web3",

                "note": "pip install web3",

                "public_amount_usdc": amount,

            },

        )

        print("[arc] Skipped — install web3")

        return



    w3 = Web3(Web3.HTTPProvider(ARC_RPC))

    w3_read = Web3(Web3.HTTPProvider(ARC_READ_RPC))

    if not w3.is_connected():

        _write_arc_state(

            state_path,

            state,

            payment,

            amount,

            "",

            {

                "status": "failed",

                "note": f"Cannot reach Arc RPC: {ARC_RPC}",

                "public_amount_usdc": amount,

            },

        )

        print("[arc] RPC unreachable")

        return



    account = w3.eth.account.from_key(PRIVATE_KEY)

    wallet = WALLET_ADDRESS or account.address



    # Re-confirm existing submitted tx (e.g. after failed sync tail)

    prev = state.get("arc") or {}

    prev_hash = prev.get("tx_hash")

    if prev_hash and prev.get("status") in ("submitted", "pending_public_settlement"):

        try:

            receipt = _try_confirm(w3_read, prev_hash, timeout=30)

            explorer_tx = f"{ARC_EXPLORER}/tx/{prev_hash}"

            _write_arc_state(

                state_path,

                state,

                payment,

                amount,

                wallet,

                {

                    "status": "confirmed",

                    "note": f"Public Arc settlement for {payment.get('tx_id', '')} (${amount} USDC nominal).",

                    "public_amount_usdc": amount,

                    "wallet": wallet,

                    "tx_hash": prev_hash,

                    "block": receipt.blockNumber,

                    "explorer_tx": explorer_tx,

                },

            )

            print(f"[arc] Previous tx now confirmed: {prev_hash}")

            print(f"[arc] Explorer: {explorer_tx}")

            return

        except Exception:

            print(f"[arc] Previous tx still pending: {prev_hash}")



    pending_nonce = w3.eth.get_transaction_count(wallet, "pending")

    latest_nonce = w3.eth.get_transaction_count(wallet, "latest")

    if pending_nonce > latest_nonce:

        print(

            f"[arc] Waiting for pending tx to clear (pending nonce {pending_nonce}, "

            f"latest {latest_nonce})…"

        )

        for _ in range(24):

            time.sleep(5)

            latest_nonce = w3.eth.get_transaction_count(wallet, "latest")

            if pending_nonce <= latest_nonce:

                break

        else:

            print("[arc] Pending tx slow — will broadcast with next pending nonce")



    try:

        tx_hex = _send_settlement(w3, wallet, PRIVATE_KEY)

    except Exception as exc:

        _write_arc_state(

            state_path,

            state,

            payment,

            amount,

            wallet,

            {

                "status": "failed",

                "note": f"Arc broadcast failed: {exc}. Run: python agents/arc_settle_swarm.py",

                "public_amount_usdc": amount,

                "wallet": wallet,

            },

        )

        print(f"[arc] Broadcast failed: {exc}")

        return



    explorer_tx = f"{ARC_EXPLORER}/tx/{tx_hex}"

    try:

        receipt = _try_confirm(w3_read, tx_hex, timeout=300)

        arc = {

            "status": "confirmed",

            "note": f"Public Arc settlement pulse for swarm payment {payment.get('tx_id', '')} (${amount} USDC nominal).",

            "public_amount_usdc": amount,

            "wallet": wallet,

            "tx_hash": tx_hex,

            "block": receipt.blockNumber,

            "explorer_tx": explorer_tx,

        }

        print(f"[arc] Settlement tx confirmed: {tx_hex}")

    except Exception as exc:

        arc = {

            "status": "submitted",

            "note": f"Tx broadcast; confirmation pending. Poll: python agents/arc_poll_tx.py {tx_hex}",

            "public_amount_usdc": amount,

            "wallet": wallet,

            "tx_hash": tx_hex,

            "explorer_tx": explorer_tx,

        }

        print(f"[arc] Tx submitted (pending): {tx_hex}")

        print(f"[arc] ({exc})")



    _write_arc_state(state_path, state, payment, amount, wallet, arc)

    print(f"[arc] Explorer: {explorer_tx}")





if __name__ == "__main__":

    main()


