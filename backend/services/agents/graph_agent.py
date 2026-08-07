from typing import Dict, Any
from services.agents.base_agent import BaseAgent
from services.graph_engine import graph_engine

class GraphIntelligenceAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="GraphIntelligenceAgent", role="Graph AI & Collusion Ring Tracing")

    def evaluate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        collusion_detected, collusion_score, rings, reasons = graph_engine.ingest_order(payload)
        return {
            "agent": self.name,
            "collusion_detected": collusion_detected,
            "collusion_score": collusion_score,
            "detected_rings_count": len(rings),
            "collusion_reasons": reasons
        }
