from typing import Dict, Any
from services.agents.base_agent import BaseAgent
from services.ml_engine import ml_engine

class FraudDetectionAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="FraudDetectionAgent", role="Tabular ML Risk Analysis")

    def evaluate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        prob, risk_score, confidence, top_features = ml_engine.predict_risk(payload)
        return {
            "agent": self.name,
            "fraud_probability": prob,
            "risk_score": risk_score,
            "confidence": confidence,
            "top_features": [f.dict() for f in top_features]
        }
