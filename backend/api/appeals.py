from fastapi import APIRouter
from typing import List, Dict, Any
import json
from models.schemas import AppealSubmission, AppealResponse, AppealStatus
from services.agents.appeal_agent import appeal_agent
from db.database import get_db_connection
from services.notification_service import notification_service

router = APIRouter(prefix="/appeals", tags=["Appeals Workflow"])

@router.post("/submit", response_model=AppealResponse)
def submit_appeal(submission: AppealSubmission):
    return appeal_agent.submit_appeal(
        entity_id=submission.entity_id,
        entity_type=submission.entity_type,
        reason=submission.reason,
        docs=submission.evidence_documents
    )

@router.get("/", response_model=List[Dict[str, Any]])
def list_appeals():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM appeals ORDER BY submitted_at DESC")
    rows = cursor.fetchall()
    conn.close()

    res = []
    for r in rows:
        res.append({
            "appeal_id": r["appeal_id"],
            "entity_id": r["entity_id"],
            "entity_type": r["entity_type"],
            "reason": r["reason"],
            "status": r["status"],
            "evidence_documents": json.loads(r["evidence_json"]) if r["evidence_json"] else [],
            "ai_confidence_score": r["ai_confidence_score"],
            "decision_notes": r["decision_notes"],
            "submitted_at": r["submitted_at"]
        })
    return res

@router.post("/review")
def review_appeal(payload: Dict[str, Any]):
    appeal_id = payload["appeal_id"]
    new_status = payload["status"]  # APPROVED or REJECTED
    reviewer_id = payload.get("reviewer_id", "INVESTIGATOR_ADMIN")
    notes = payload.get("notes", "Reviewed by investigator.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE appeals 
        SET status = ?, reviewed_by = ?, decision_notes = ? 
        WHERE appeal_id = ?
    ''', (new_status, reviewer_id, notes, appeal_id))
    conn.commit()
    conn.close()

    notification_service.send_appeal_update(
        recipient_email=f"appeal-{appeal_id}@trustgraph.ai",
        appeal_id=appeal_id,
        status=new_status,
        notes=notes
    )

    return {"status": "SUCCESS", "appeal_id": appeal_id, "new_status": new_status}
