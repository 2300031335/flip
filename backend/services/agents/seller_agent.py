from typing import Dict, Any
from services.agents.base_agent import BaseAgent

class SellerRiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="SellerRiskAgent", role="Seller History & Chargeback Risk Evaluation")

    def evaluate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        seller_id = payload.get("seller_id", "")
        # High Risk Seller flag simulation
        is_high_risk = seller_id in ["SELL-881", "SELL-999"]
        refund_ratio = 0.38 if is_high_risk else 0.03
        chargeback_velocity = 8 if is_high_risk else 0
        
        return {
            "agent": self.name,
            "seller_id": seller_id,
            "refund_ratio": refund_ratio,
            "chargeback_velocity_24h": chargeback_velocity,
            "risk_flag": is_high_risk,
            "summary": f"Seller refund ratio at {refund_ratio*100:.1f}%. Chargebacks: {chargeback_velocity} in 24h."
        }
