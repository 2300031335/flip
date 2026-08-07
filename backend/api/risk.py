from fastapi import APIRouter
from typing import Dict, Any
from models.schemas import OrderCreateRequest, MultiActorRiskResponse
from services.agents.decision_agent import decision_agent

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])

@router.post("/evaluate", response_model=MultiActorRiskResponse)
def evaluate_risk(order: OrderCreateRequest):
    return decision_agent.process_order(order.dict())
