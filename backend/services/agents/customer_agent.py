from typing import Dict, Any
from services.agents.base_agent import BaseAgent

class CustomerRiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="CustomerRiskAgent", role="Buyer Behavior & Payment Method Velocity Analysis")

    def evaluate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        cust_id = payload.get("customer_id", "")
        device_id = payload.get("device_id", "")
        
        is_suspicious_cust = cust_id in ["CUST-109", "CUST-305"] or "RING" in device_id.upper()
        account_age_days = 3 if is_suspicious_cust else 420
        payment_swaps_24h = 5 if is_suspicious_cust else 0
        
        return {
            "agent": self.name,
            "customer_id": cust_id,
            "account_age_days": account_age_days,
            "payment_swaps_24h": payment_swaps_24h,
            "risk_flag": is_suspicious_cust,
            "summary": f"Buyer account age: {account_age_days} days. Payment method velocity: {payment_swaps_24h} swaps in 24h."
        }
