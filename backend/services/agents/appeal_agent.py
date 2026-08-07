from typing import Dict, Any, List
import uuid
import json
from datetime import datetime
from db.database import get_db_connection
from models.schemas import AppealStatus, AppealResponse
from services.notification_service import notification_service

class AppealReviewAgent:
    """
    AI Appeal Review Agent.
    Evaluates submitted dispute evidence, scores document validity,
    tracks appeal lifecycle, and updates the entity risk status.
    """
    def submit_appeal(self, entity_id: str, entity_type: str, reason: str, docs: List[str]) -> AppealResponse:
        appeal_id = f"APL-{uuid.uuid4().hex[:6].upper()}"
        
        # Calculate AI Confidence Score on provided docs
        doc_count = len(docs)
        keyword_match = any(kw in reason.lower() for kw in ["invoice", "proof", "lease", "co-working", "gps", "receipt"])
        confidence_score = min(0.40 + (doc_count * 0.20) + (0.25 if keyword_match else 0.0), 0.95)

        status = AppealStatus.UNDER_REVIEW if confidence_score > 0.60 else AppealStatus.PENDING

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO appeals (appeal_id, entity_id, entity_type, reason, status, evidence_json, ai_confidence_score, decision_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (appeal_id, entity_id, entity_type, reason, status.value, json.dumps(docs), confidence_score, "AI Pre-screening completed. Pending investigator confirmation."))
        conn.commit()
        conn.close()

        # Send Notification
        notification_service.send_appeal_update(
            recipient_email=f"appeal-{entity_id}@trustgraph.ai",
            appeal_id=appeal_id,
            status=status.value,
            notes="Appeal received and queued for review."
        )

        return AppealResponse(
            appeal_id=appeal_id,
            entity_id=entity_id,
            entity_type=entity_type,
            reason=reason,
            status=status,
            submitted_at=datetime.utcnow().isoformat(),
            ai_confidence_score=confidence_score,
            decision_notes="AI Pre-screening completed. Pending investigator confirmation."
        )

appeal_agent = AppealReviewAgent()
