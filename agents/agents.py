import random

# ---------------------------
# BASE AGENT
# ---------------------------


class Agent:
    def __init__(self, name):
        self.name = name
        self.capital = 100.0
        self.performance = 1.0

    def log(self, msg):
        return {
            "agent": self.name,
            "message": msg
        }


# ---------------------------
# ORACLE
# ---------------------------
class Oracle(Agent):
    def act(self, state):
        if state["price"] > 100:
            signal = "sell"
        else:
            signal = "buy"

        confidence = random.uniform(0.6, 0.99)

        return {
            "signal": signal,
            "confidence": confidence
        }


# ---------------------------
# STRATEGIST
# ---------------------------
class Strategist(Agent):
    def act(self, state, oracle_msg):
        signal = oracle_msg["signal"]
        confidence = oracle_msg["confidence"]

        if confidence < 0.7:
            decision = "hold"
        else:
            decision = signal

        bias = 1 if decision == "buy" else -1 if decision == "sell" else 0

        return {
            "decision": decision,
            "bias": bias
        }


# ---------------------------
# EXECUTOR
# ---------------------------
class Executor(Agent):
    def act(self, state, strategy_msg):
        bias = strategy_msg["bias"]

        pnl = bias * random.uniform(-1.2, 2.0)

        self.capital += pnl
        self.performance = self.capital / 100.0

        return {
            "pnl": pnl,
            "capital": self.capital
        }


# ---------------------------
# EVALUATOR
# ---------------------------
class Evaluator(Agent):
    def act(self, state, exec_msg):
        pnl = exec_msg["pnl"]

        if pnl > 0:
            self.performance *= 1.02
        else:
            self.performance *= 0.98

        return {
            "performance": self.performance
        }
