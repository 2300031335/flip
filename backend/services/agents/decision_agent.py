from typing import Dict, Any, List
from services.agents.fraud_agent import FraudDetectionAgent
from services.agents.graph_agent import GraphIntelligenceAgent
from services.agents.seller_agent import SellerRiskAgent
from services.agents.customer_agent import CustomerRiskAgent
from services.agents.delivery_agent import DeliveryRiskAgent
from services.remediation_engine import remediation_engine
from services.audit_ledger import audit_ledger
from services.notification_service import notification_service
from models.schemas import MultiActorRiskResponse, FeatureContribution, RemediationAction

class DecisionAgent:
    """
    Master Decision & Orchestration Agent.
    Coordinates all specialized risk agents, calculates composite risk score,
    applies Graduated Remediation policy, commits to SHA-256 Audit Trail,
    and returns Explainable AI (XAI) output.
    """
    def __init__(self):
        self.fraud_agent = FraudDetectionAgent()
        self.graph_agent = GraphIntelligenceAgent()
        self.seller_agent = SellerRiskAgent()
        self.customer_agent = CustomerRiskAgent()
        self.delivery_agent = DeliveryRiskAgent()

    def process_order(self, payload: Dict[str, Any]) -> MultiActorRiskResponse:
        order_id = payload["order_id"]
        
        # 1. Execute Sub-Agents in Parallel / Pipeline
        fraud_sig = self.fraud_agent.evaluate(payload)
        graph_sig = self.graph_agent.evaluate(payload)
        seller_sig = self.seller_agent.evaluate(payload)
        customer_sig = self.customer_agent.evaluate(payload)
        delivery_sig = self.delivery_agent.evaluate(payload)

        # 2. Risk Signal Synthesis
        base_score = fraud_sig["risk_score"]
        collusion_boost = 25 if graph_sig["collusion_detected"] else 0
        seller_boost = 15 if seller_sig["risk_flag"] else 0
        customer_boost = 10 if customer_sig["risk_flag"] else 0
        delivery_boost = 10 if delivery_sig["telematics_anomaly"] else 0

        composite_score = min(base_score + collusion_boost + seller_boost + customer_boost + delivery_boost, 100)
        fraud_probability = min(composite_score / 100.0, 0.99)

        # 3. Graduated Remediation Policy
        action, risk_level = remediation_engine.evaluate(composite_score, graph_sig["collusion_detected"])

        # 4. Construct Explainable Natural Language Reasons
        explanations = []
        if graph_sig["collusion_detected"]:
            explanations.extend(graph_sig["collusion_reasons"])
        if seller_sig["risk_flag"]:
            explanations.append(seller_sig["summary"])
        if customer_sig["risk_flag"]:
            explanations.append(customer_sig["summary"])
        if delivery_sig["telematics_anomaly"]:
            explanations.append(delivery_sig["summary"])

        if not explanations:
            explanations.append("Transaction verified cleanly against historical behavioral baselines.")

        # 5. Append to Cryptographic Audit Ledger
        audit_block = audit_ledger.append_entry(
            order_id=order_id,
            action=action.value,
            risk_score=composite_score,
            reviewer_id="MULTI_AGENT_SYSTEM",
            payload=payload
        )

        # 6. Dispatch Notifications if Action != APPROVE
        if action != RemediationAction.APPROVE:
            notification_service.send_risk_alert(
                recipient_email=f"alert-{payload.get('customer_id')}@trustgraph.ai",
                order_id=order_id,
                action=action.value,
                reason=explanations[0]
            )

        # 7. Convert Top Features to FeatureContribution Models
        top_feats = [FeatureContribution(**f) for f in fraud_sig["top_features"]]

        return MultiActorRiskResponse(
            order_id=order_id,
            fraud_probability=fraud_probability,
            risk_score=composite_score,
            risk_level=risk_level,
            confidence=fraud_sig["confidence"],
            action=action,
            collusion_detected=graph_sig["collusion_detected"],
            collusion_score=graph_sig["collusion_score"],
            top_features=top_feats,
            natural_explanations=explanations,
            agent_breakdowns={
                "fraud_agent": fraud_sig,
                "graph_agent": graph_sig,
                "seller_agent": seller_sig,
                "customer_agent": customer_sig,
                "delivery_agent": delivery_sig,
                "audit_block_hash": audit_block.block_hash
            }
        )

decision_agent = DecisionAgent()
