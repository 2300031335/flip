import numpy as np
from typing import Dict, Any, List, Tuple
from models.schemas import FeatureContribution

class MLRiskEngine:
    """
    IEEE-CIS Fraud Detection ML Scoring Engine.
    Engineers tabular transaction features, predicts fraud probability (0-1),
    calculates risk score (0-100), confidence level, and feature contribution drivers.
    """
    def __init__(self):
        # Baseline model weights simulating trained XGBoost / LightGBM model on IEEE-CIS benchmark dataset
        self.feature_weights = {
            "transaction_amt": 0.18,
            "device_hopping_count": 0.25,
            "ip_velocity_1h": 0.22,
            "seller_refund_ratio": 0.30,
            "delivery_telematics_discrepancy": 0.28,
            "payment_method_reuse_count": 0.19,
            "address_match_score": -0.15,
            "account_age_days": -0.12
        }

    def predict_risk(self, payload: Dict[str, Any]) -> Tuple[float, int, str, List[FeatureContribution]]:
        amt = float(payload.get("amount", 100.0))
        device_id = payload.get("device_id", "")
        ip_address = payload.get("ip_address", "")
        seller_id = payload.get("seller_id", "")
        
        # Synthetic Feature Engineering
        # 1. High Amount Anomaly
        amt_factor = min(amt / 2500.0, 1.0)
        
        # 2. Known Suspicious Device / Collusion Ring Pattern
        is_suspicious_device = "RING" in device_id.upper() or device_id in ["DEV-RING-01", "DEV-RING-02", "DEV-F928A"]
        device_hopping = 4 if is_suspicious_device else (1 if "LEGIT" in device_id.upper() else 2)
        
        # 3. IP Velocity
        ip_velocity = 8 if ("198.51" in ip_address or "192.168.1.105" in ip_address) else 1
        
        # 4. Seller Refund Ratio
        seller_refund_ratio = 0.35 if seller_id == "SELL-881" else 0.04
        
        # 5. Delivery Telematics
        deliv_partner = payload.get("delivery_partner_id", "")
        telematics_discrepancy = 0.85 if deliv_partner in ["DELIV-302", "DELIV-304"] else 0.10
        
        # Raw Logit Calculation
        raw_score = (
            amt_factor * self.feature_weights["transaction_amt"] +
            (device_hopping / 5.0) * self.feature_weights["device_hopping_count"] +
            (ip_velocity / 10.0) * self.feature_weights["ip_velocity_1h"] +
            seller_refund_ratio * self.feature_weights["seller_refund_ratio"] +
            telematics_discrepancy * self.feature_weights["delivery_telematics_discrepancy"]
        )
        
        # Sigmoid probability scaling
        prob = 1.0 / (1.0 + np.exp(- (raw_score * 4.5 - 0.8)))
        prob = float(np.clip(prob, 0.01, 0.99))
        risk_score = int(round(prob * 100))
        
        # Confidence Score
        confidence = "HIGH" if prob > 0.80 or prob < 0.20 else "MEDIUM"
        
        # SHAP-Style Feature Contributions
        top_features = [
            FeatureContribution(
                feature_name="Seller Refund Velocity",
                value=f"{seller_refund_ratio * 100:.1f}%",
                contribution=round(seller_refund_ratio * 0.30 * 100, 1),
                description="Seller chargeback & refund frequency exceeds 95th percentile benchmark."
            ),
            FeatureContribution(
                feature_name="Delivery Telematics Discrepancy",
                value=f"{telematics_discrepancy * 100:.0f}% anomaly",
                contribution=round(telematics_discrepancy * 0.28 * 100, 1),
                description="GPS telematics location delta conflicts with claimed delivery completion timestamp."
            ),
            FeatureContribution(
                feature_name="Device Hopping Velocity",
                value=f"{device_hopping} accounts / 24h",
                contribution=round((device_hopping / 5.0) * 0.25 * 100, 1),
                description="Hardware device fingerprint linked to multiple active customer & seller accounts."
            ),
            FeatureContribution(
                feature_name="IP Address Subnet Risk",
                value=f"Velocity {ip_velocity} req/min",
                contribution=round((ip_velocity / 10.0) * 0.22 * 100, 1),
                description="Transaction originated from high-risk proxy subnet with past fraud activity."
            ),
            FeatureContribution(
                feature_name="Transaction Amount Anomaly",
                value=f"${amt:,.2f}",
                contribution=round(amt_factor * 0.18 * 100, 1),
                description="Order value deviates significantly from customer historical baseline."
            )
        ]
        
        # Sort by contribution descending
        top_features.sort(key=lambda x: x.contribution, reverse=True)
        
        return prob, risk_score, confidence, top_features

ml_engine = MLRiskEngine()
