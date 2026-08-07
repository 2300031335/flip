from fastapi import APIRouter
from models.schemas import GraphData
from services.graph_engine import graph_engine

router = APIRouter(prefix="/graph", tags=["Graph AI"])

@router.get("/", response_model=GraphData)
def get_graph():
    return graph_engine.get_full_graph_data()
