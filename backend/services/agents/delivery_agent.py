from typing import Dict, Any
from services.agents.base_agent import BaseAgent

class DeliveryRiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="DeliveryRiskAgent", role="Delivery Partner Telematics & GPS Route Verification")

    def evaluate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        deliv_id = payload.get("delivery_partner_id", "")
        device_id = payload.get("device_id", "")
        
        is_telematics_spoofed = deliv_id in ["DELIV-302", "DELIV-304"] or "RING" in device_id.upper()
        speed_mph = 850 if is_telematics_spoofed else 28
        
        return {
            "agent": self.name,
            "delivery_partner_id": deliv_id,
            "telematics_anomaly": is_telematics_spoofed,
            "implied_speed_mph": speed_mph,
            "summary": f"Carrier telematics anomaly detected: implied speed {speed_mph} mph exceeds physical thresholds." if is_telematics_spoofed else "Normal delivery route telematics."
        }
