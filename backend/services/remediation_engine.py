from typing import Tuple
from models.schemas import RemediationAction, RiskLevel
from config import settings

class GraduatedRemediationEngine:
    """
    Graduated Remediation Policy Matrix Engine.
    Prevents blunt immediate banz by applying calibrated friction based on multi-factor risk scores.
    """
    def evaluate(self, risk_score: int, collusion_detected: bool) -> Tuple[RemediationAction, RiskLevel]:
        # If collusion ring is explicitly detected, escalate risk level
        effective_score = min(risk_score + 15, 100) if collusion_detected else risk_score

        if effective_score >= settings.RISK_THRESHOLD_CRITICAL:
            return RemediationAction.SUSPEND_ACCOUNTS, RiskLevel.CRITICAL
        elif effective_score >= settings.RISK_THRESHOLD_HIGH:
            return RemediationAction.HUMAN_REVIEW, RiskLevel.VERY_HIGH
        elif effective_score >= settings.RISK_THRESHOLD_MEDIUM:
            return RemediationAction.HOLD_PAYOUT, RiskLevel.HIGH
        elif effective_score >= settings.RISK_THRESHOLD_LOW:
            return RemediationAction.REQUIRE_OTP, RiskLevel.MEDIUM
        else:
            return RemediationAction.APPROVE, RiskLevel.LOW

remediation_engine = GraduatedRemediationEngine()
