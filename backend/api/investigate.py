from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import json
from db.database import get_db_connection
from services.audit_ledger import audit_ledger

router = APIRouter(prefix="/investigate", tags=["Investigator Workbench"])

@router.get("/queue")
def get_investigation_queue():
    """Returns orders requiring human review (Risk Score >= 80 or Action == HUMAN_REVIEW)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE risk_score >= 80 OR action = 'HUMAN_REVIEW' ORDER BY risk_score DESC")
    rows = cursor.fetchall()
    conn.close()

    queue = []
    for r in rows:
        queue.append({
            "order_id": r["order_id"],
            "customer_id": r["customer_id"],
            "seller_id": r["seller_id"],
            "delivery_partner_id": r["delivery_partner_id"],
            "amount": r["amount"],
            "risk_score": r["risk_score"],
            "risk_level": r["risk_level"],
            "action": r["action"],
            "collusion_detected": bool(r["collusion_detected"]),
            "collusion_score": r["collusion_score"],
            "assessment": json.loads(r["assessment_json"]),
            "created_at": r["created_at"]
        })
    return queue

@router.post("/override")
def override_decision(payload: Dict[str, Any]):
    order_id = payload.get("order_id")
    new_action = payload.get("new_action")
    reviewer_id = payload.get("reviewer_id", "INVESTIGATOR_MARCUS")
    reason = payload.get("reason", "Manual verification completed.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET action = ? WHERE order_id = ?", (new_action, order_id))
    conn.commit()
    conn.close()

    # Log manual override in Cryptographic Audit Ledger
    audit_block = audit_ledger.append_entry(
        order_id=order_id,
        action=f"MANUAL_OVERRIDE_{new_action}",
        risk_score=0 if new_action == "APPROVE" else 99,
        reviewer_id=reviewer_id,
        payload={"reason": reason, "overridden_to": new_action}
    )

    return {"status": "SUCCESS", "order_id": order_id, "new_action": new_action, "audit_hash": audit_block.block_hash}
