from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import json
from models.schemas import OrderCreateRequest, MultiActorRiskResponse
from services.agents.decision_agent import decision_agent
from db.database import get_db_connection

router = APIRouter(prefix="/orders", tags=["Orders & Transactions"])

@router.post("/process", response_model=MultiActorRiskResponse)
def process_transaction(order: OrderCreateRequest):
    payload = order.dict()
    response = decision_agent.process_order(payload)
    
    # Store in database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        REPLACE INTO orders 
        (order_id, customer_id, seller_id, delivery_partner_id, amount, fraud_probability, risk_score, risk_level, action, collusion_detected, collusion_score, raw_payload, assessment_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        order.order_id, order.customer_id, order.seller_id, order.delivery_partner_id,
        order.amount, response.fraud_probability, response.risk_score, response.risk_level.value,
        response.action.value, response.collusion_detected, response.collusion_score,
        json.dumps(payload), json.dumps(response.dict(), default=str)
    ))
    conn.commit()
    conn.close()

    return response

@router.get("/", response_model=List[Dict[str, Any]])
def list_orders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "order_id": r["order_id"],
            "customer_id": r["customer_id"],
            "seller_id": r["seller_id"],
            "delivery_partner_id": r["delivery_partner_id"],
            "amount": r["amount"],
            "fraud_probability": r["fraud_probability"],
            "risk_score": r["risk_score"],
            "risk_level": r["risk_level"],
            "action": r["action"],
            "collusion_detected": bool(r["collusion_detected"]),
            "collusion_score": r["collusion_score"],
            "created_at": r["created_at"]
        })
    return result

@router.get("/{order_id}")
def get_order_details(order_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order_id": row["order_id"],
        "customer_id": row["customer_id"],
        "seller_id": row["seller_id"],
        "delivery_partner_id": row["delivery_partner_id"],
        "amount": row["amount"],
        "risk_assessment": json.loads(row["assessment_json"]),
        "created_at": row["created_at"]
    }
