# System Architecture & Technical Specifications - Trust Graph Platform

## 1. High-Level Enterprise Microservices Architecture

```mermaid
graph TD
    Client[React 18 MUI Dark UI] -->|REST APIs + JWT| Gateway[FastAPI Enterprise API Gateway]
    
    subgraph Multi-Agent AI System
        Gateway -->|Orchestrates| DecisionAgent[Decision & Remediation Agent]
        DecisionAgent --> CustomerAgent[Customer Risk Agent]
        DecisionAgent --> SellerAgent[Seller Risk Agent]
        DecisionAgent --> DeliveryAgent[Delivery Risk Agent]
        DecisionAgent --> GraphAgent[Graph Intelligence Agent]
        DecisionAgent --> XAIAgent[Explainable XAI Agent]
        DecisionAgent --> AuditAgent[Immutable Audit Trail Agent]
    end

    subgraph Core AI & ML Engines
        GraphAgent --> GraphAI[NetworkX Graph AI - Collusion Ring & Cycle Detection]
        CustomerAgent & SellerAgent & DeliveryAgent --> MLEngine[XGBoost / LightGBM ML Risk Model]
        XAIAgent --> SHAP[SHAP / Feature Attribution Engine]
    end

    subgraph Data & Storage Layer
        Gateway --> DB[(PostgreSQL Data Store)]
        GraphAI --> GraphDB[(Graph Engine - Nodes & Edges)]
        AuditAgent --> CryptoLedger[(Cryptographic SHA-256 Chained Audit Trail)]
        Gateway --> Redis[(Redis Cache & Rate Limiting)]
    end
```

---

## 2. Order Processing & Multi-Agent Risk Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Buyer/E-Commerce Checkout
    participant Gateway as FastAPI Gateway
    participant Decision as Decision Agent
    participant Graph as Graph AI Engine
    participant ML as IEEE-CIS ML Engine
    participant Remediation as Graduated Remediation
    participant Audit as SHA-256 Audit Ledger
    participant UI as Investigator Dashboard

    User->>Gateway: POST /api/v1/orders/process (Order Payload)
    Gateway->>Decision: Orchestrate Multi-Agent Evaluation
    Decision->>Graph: Query Node Topology & Collusion Rings
    Graph-->>Decision: Collusion Score: 94.5 (3 Shared Devices, Cycle Detected)
    Decision->>ML: Predict Tabular Fraud Probability
    ML-->>Decision: Fraud Probability: 0.96 (SHAP Top Features)
    Decision->>Remediation: Evaluate Policy Matrix (Score: 96)
    Remediation-->>Decision: Action: SUSPEND_ACCOUNTS (Critical Risk)
    Decision->>Audit: Append Block Hash (SHA-256 Block Chaining)
    Audit-->>Decision: Block Hash: 0f8a9e...
    Decision-->>Gateway: MultiActorRiskResponse Payload
    Gateway-->>User: Order Response (Graduated Action Enforced)
    Gateway->>UI: Real-Time WebSockets Event (Flagged Case Queue)
```

---

## 3. Data Models & Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    SELLERS ||--o{ ORDERS : fulfills
    DELIVERY_PARTNERS ||--o{ ORDERS : delivers
    ORDERS ||--|| RISK_ASSESSMENTS : generates
    RISK_ASSESSMENTS ||--|| AUDIT_LOGS : commits
    SELLERS ||--o{ APPEALS : files
    DELIVERY_PARTNERS ||--o{ APPEALS : files

    USERS {
        string user_id PK
        string username
        string role
    }

    ORDERS {
        string order_id PK
        float amount
        string status
    }

    RISK_ASSESSMENTS {
        string assessment_id PK
        int risk_score
        string action
        boolean collusion_detected
    }

    AUDIT_LOGS {
        int block_index PK
        string payload_hash
        string previous_hash
        string block_hash
    }
```
