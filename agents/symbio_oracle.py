import os
import asyncio
import json
from dotenv import load_dotenv

load_dotenv()

# === CORRECT DeepSeek Import ===
from langchain_deepseek import ChatDeepSeek

def get_llm():
    return ChatDeepSeek(
        model="deepseek-chat",
        temperature=0.7,
        api_key=os.getenv("DEEPSEEK_API_KEY")
    )

# AXL stub
async def broadcast_to_swarm(message):
    print(f"📡 [AXL BROADCAST] {message}")
    await asyncio.sleep(0.2)
    return {"status": "ok"}

async def send_nanopay(amount=0.001, memo="signal"):
    print(f"💸 [SIMULATED NANOPAY] ${amount} USDC → {memo}")
    return {"status": "ok"}

llm = get_llm()

async def oracle_agent(cycle=1):
    prompt = f"""You are the Oracle Agent inside SymbioMarket — a self-evolving swarm of trading agents on Arc.
Cycle: {cycle} | Date: May 15, 2026

Return **ONLY** valid JSON (no extra text):
{{
  "signal": "bullish|bearish|neutral",
  "confidence": 65,
  "reason": "one sentence market insight",
  "suggested_action": "buy ETH | sell BTC | hold | rebalance"
}}"""

    response = await llm.ainvoke(prompt)
    content = response.content if hasattr(response, "content") else str(response)
    
    try:
        data = json.loads(content)
        print(f"\n🧠 === Oracle Cycle {cycle} ===")
        print(json.dumps(data, indent=2))
        
        await broadcast_to_swarm({"agent": "oracle", "payload": data})
        await send_nanopay(0.001, f"oracle_to_strategist_{cycle}")
        
    except Exception as e:
        print("❌ Parse error:", e)
        print("Raw output:", content[:500])

async def main():
    print("🚀 SymbioMarket Swarm — Oracle Starting...\n")
    for i in range(4):
        await oracle_agent(i+1)
        await asyncio.sleep(6)

if __name__ == "__main__":
    asyncio.run(main())
