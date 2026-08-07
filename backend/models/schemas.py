from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    INVESTIGATOR = "INVESTIGATOR"
    AUDITOR = "AUDITOR"
    CUSTOMER = "CUSTOMER"
    SELLER = "SELLER"
    DELIVERY_PARTNER = "DELIVERY_PARTNER"

class RemediationAction(str, Enum):
    APPROVE = "APPROVE"
    REQUIRE_OTP = "REQUIRE_OTP"
    HOLD_PAYOUT = "HOLD_PAYOUT"
    HUMAN_REVIEW = "HUMAN_REVIEW"
    SUSPEND_ACCOUNTS = "SUSPEND_ACCOUNTS"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    VERY_HIGH = "VERY_HIGH"
    CRITICAL = "CRITICAL"

class NodeCategory(str, Enum):
    CUSTOMER = "CUSTOMER"
    SELLER = "SELLER"
    DELIVERY_PARTNER = "DELIVERY_PARTNER"
    DEVICE = "DEVICE"
    IP_ADDRESS = "IP_ADDRESS"
    PHONE = "PHONE"
    ADDRESS = "ADDRESS"
    BANK_ACCOUNT = "BANK_ACCOUNT"
    ORDER = "ORDER"

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str
    name: str

class LoginRequest(BaseModel):
    username: str
    password: str

# Order & Transaction Request Payload
class OrderCreateRequest(BaseModel):
    order_id: str = Field(..., example="ORD-98234")
    customer_id: str = Field(..., example="CUST-4012")
    customer_name: str = "Alice Vance"
    seller_id: str = Field(..., example="SELL-8812")
    seller_name: str = "TechVault Global"
    delivery_partner_id: str = Field(..., example="DELIV-304")
    delivery_partner_name: str = "Express Logistics LLC"
    amount: float = Field(..., example=1250.00)
    device_id: str = Field(..., example="DEV-F928A")
    ip_address: str = Field(..., example="192.168.1.105")
    phone: str = Field(..., example="+1-555-0192")
    shipping_address: str = Field(..., example="742 Evergreen Terrace, Springfield")
    bank_account_hash: str = Field(..., example="BANK-783921")
    payment_method: str = Field(default="CREDIT_CARD")
    item_category: str = Field(default="ELECTRONICS")

# Feature Explanation Model
class FeatureContribution(BaseModel):
    feature_name: str
    value: Any
    contribution: float
    description: str

# Multi-Actor Risk Assessment Response
class MultiActorRiskResponse(BaseModel):
    order_id: str
    fraud_probability: float
    risk_score: int
    risk_level: RiskLevel
    confidence: str
    action: RemediationAction
    collusion_detected: bool
    collusion_score: float
    top_features: List[FeatureContribution]
    natural_explanations: List[str]
    agent_breakdowns: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Graph Schema
class GraphNode(BaseModel):
    id: str
    label: str
    category: NodeCategory
    risk_score: int = 0
    is_suspicious: bool = False
    details: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    source: str
    target: str
    relation: str
    weight: float = 1.0
    details: Dict[str, Any] = {}

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    collusion_rings: List[List[str]] = []
    dense_clusters_count: int = 0

# Appeal Schemas
class AppealStatus(str, Enum):
    PENDING = "PENDING"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class AppealSubmission(BaseModel):
    entity_id: str
    entity_type: str  # SELLER or DELIVERY_PARTNER
    reason: str
    evidence_documents: List[str] = []

class AppealResponse(BaseModel):
    appeal_id: str
    entity_id: str
    entity_type: str
    reason: str
    status: AppealStatus
    submitted_at: datetime
    reviewed_by: Optional[str] = None
    ai_confidence_score: float = 0.0
    decision_notes: Optional[str] = None

# Audit Log Schema
class AuditBlock(BaseModel):
    index: int
    timestamp: str
    order_id: str
    action: str
    risk_score: int
    reviewer_id: str
    model_version: str
    payload_hash: str
    previous_hash: str
    block_hash: str

# Metric & KPI Summary
class MetricsSummary(BaseModel):
    total_transactions_scanned: int
    total_fraud_blocked: int
    revenue_saved_usd: float
    collusion_rings_detected: int
    pending_appeals_count: int
    precision: float
    recall: float
    f1_score: float
    top_risk_sellers: List[Dict[str, Any]]
    top_risk_customers: List[Dict[str, Any]]
    top_risk_delivery_partners: List[Dict[str, Any]]
