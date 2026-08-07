import sqlite3
import hashlib
import json
from datetime import datetime, timedelta
from db.database import get_db_connection, init_db

def get_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Seed System Users (Default Password: "password123")
    hashed_pwd = get_hash("password123")
    users = [
        ("USR-001", "admin@trustgraph.ai", hashed_pwd, "Sarah Jenkins (Principal Architect)", "ADMIN"),
        ("USR-002", "investigator@trustgraph.ai", hashed_pwd, "Marcus Vance (Lead Fraud Investigator)", "INVESTIGATOR"),
        ("USR-003", "auditor@trustgraph.ai", hashed_pwd, "Elena Rostova (Compliance Auditor)", "AUDITOR"),
        ("USR-004", "seller_nexus@trustgraph.ai", hashed_pwd, "Nexus Electronics (Seller)", "SELLER"),
    ]

    for u in users:
        cursor.execute('''
            REPLACE INTO users (id, username, password_hash, name, role)
            VALUES (?, ?, ?, ?, ?)
        ''', u)

    # 2. Seed Historical Orders & Risk Assessments
    historical_orders = [
        {
            "order_id": "ORD-9801",
            "customer_id": "CUST-109",
            "seller_id": "SELL-881",
            "delivery_partner_id": "DELIV-302",
            "amount": 3499.00,
            "fraud_probability": 0.96,
            "risk_score": 96,
            "risk_level": "CRITICAL",
            "action": "SUSPEND_ACCOUNTS",
            "collusion_detected": True,
            "collusion_score": 94.5,
            "raw_payload": json.dumps({
                "device_id": "DEV-RING-01",
                "ip_address": "198.51.100.44",
                "shipping_address": "404 Phantom Loop, Austin TX"
            }),
            "assessment_json": json.dumps({
                "reasons": [
                    "Multi-Actor Collusion: Customer CUST-109 & Seller SELL-881 share 3 physical devices",
                    "Circular Refund Loop: 5 refunds issued back to the same Bank Hash within 48 hours",
                    "Delivery Telematics Anomaly: Delivery Partner DELIV-302 marked completed 12 miles in 0 seconds"
                ]
            })
        },
        {
            "order_id": "ORD-9802",
            "customer_id": "CUST-204",
            "seller_id": "SELL-442",
            "delivery_partner_id": "DELIV-110",
            "amount": 180.50,
            "fraud_probability": 0.12,
            "risk_score": 12,
            "risk_level": "LOW",
            "action": "APPROVE",
            "collusion_detected": False,
            "collusion_score": 5.0,
            "raw_payload": json.dumps({
                "device_id": "DEV-LEGIT-99",
                "ip_address": "203.0.113.12",
                "shipping_address": "123 Main St, Seattle WA"
            }),
            "assessment_json": json.dumps({
                "reasons": ["Standard transaction pattern", "Verified device history"]
            })
        },
        {
            "order_id": "ORD-9803",
            "customer_id": "CUST-305",
            "seller_id": "SELL-881",
            "delivery_partner_id": "DELIV-302",
            "amount": 2150.00,
            "fraud_probability": 0.88,
            "risk_score": 88,
            "risk_level": "VERY_HIGH",
            "action": "HUMAN_REVIEW",
            "collusion_detected": True,
            "collusion_score": 89.0,
            "raw_payload": json.dumps({
                "device_id": "DEV-RING-01",
                "ip_address": "198.51.100.44",
                "shipping_address": "404 Phantom Loop, Austin TX"
            }),
            "assessment_json": json.dumps({
                "reasons": [
                    "High Collusion Cluster: Shared device with suspended Seller SELL-881",
                    "High Velocity Payout Spike: 4 high-value transactions in 10 minutes"
                ]
            })
        },
        {
            "order_id": "ORD-9804",
            "customer_id": "CUST-501",
            "seller_id": "SELL-209",
            "delivery_partner_id": "DELIV-404",
            "amount": 620.00,
            "fraud_probability": 0.65,
            "risk_score": 65,
            "risk_level": "HIGH",
            "action": "HOLD_PAYOUT",
            "collusion_detected": False,
            "collusion_score": 35.0,
            "raw_payload": json.dumps({
                "device_id": "DEV-NEW-44",
                "ip_address": "198.51.100.99",
                "shipping_address": "900 Market St, San Francisco CA"
            }),
            "assessment_json": json.dumps({
                "reasons": [
                    "Unusual payment velocity change",
                    "Seller chargeback ratio exceeded 4.5% threshold"
                ]
            })
        }
    ]

    for o in historical_orders:
        cursor.execute('''
            REPLACE INTO orders 
            (order_id, customer_id, seller_id, delivery_partner_id, amount, fraud_probability, risk_score, risk_level, action, collusion_detected, collusion_score, raw_payload, assessment_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            o["order_id"], o["customer_id"], o["seller_id"], o["delivery_partner_id"],
            o["amount"], o["fraud_probability"], o["risk_score"], o["risk_level"],
            o["action"], o["collusion_detected"], o["collusion_score"],
            o["raw_payload"], o["assessment_json"]
        ))

    # 3. Seed Appeals Data
    appeals = [
        ("APL-101", "SELL-881", "SELLER", "We provided valid proof of shipment and invoices for ORD-9801. Device sharing was due to co-working office IP.", "UNDER_REVIEW", json.dumps(["invoice_9801.pdf", "coworking_lease.pdf"]), 0.72, "Pending investigator manual review of lease docs."),
        ("APL-102", "DELIV-302", "DELIVERY_PARTNER", "GPS anomaly caused by tunnel signal loss during delivery scan.", "PENDING", json.dumps(["telematics_gps_log.csv"]), 0.81, "AI verification pending.")
    ]

    for a in appeals:
        cursor.execute('''
            REPLACE INTO appeals 
            (appeal_id, entity_id, entity_type, reason, status, evidence_json, ai_confidence_score, decision_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', a)

    # 4. Seed Initial Cryptographic Audit Ledger Block Chain
    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    if cursor.fetchone()[0] == 0:
        prev_hash = "0" * 64
        genesis_time = (datetime.utcnow() - timedelta(days=2)).isoformat()
        
        # Genesis Block (Index 1)
        gen_payload_h = hashlib.sha256(b"GENESIS").hexdigest()
        block_content = f"1|{genesis_time}|GENESIS-000|SYSTEM_START|0|SYSTEM|1.0.0|{gen_payload_h}|{prev_hash}"
        genesis_hash = hashlib.sha256(block_content.encode()).hexdigest()
        
        cursor.execute('''
            INSERT INTO audit_logs (timestamp, order_id, action, risk_score, reviewer_id, model_version, payload_hash, previous_hash, block_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (genesis_time, "GENESIS-000", "SYSTEM_START", 0, "SYSTEM", "1.0.0", gen_payload_h, prev_hash, genesis_hash))
        
        # Block 2 - ORD-9801 (Index 2)
        block1_time = (datetime.utcnow() - timedelta(days=1)).isoformat()
        payload_h1 = hashlib.sha256(b"ORD-9801_SUSPEND").hexdigest()
        b1_data = f"2|{block1_time}|ORD-9801|SUSPEND_ACCOUNTS|96|DECISION_AGENT|1.0.0|{payload_h1}|{genesis_hash}"
        b1_hash = hashlib.sha256(b1_data.encode()).hexdigest()
        
        cursor.execute('''
            INSERT INTO audit_logs (timestamp, order_id, action, risk_score, reviewer_id, model_version, payload_hash, previous_hash, block_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (block1_time, "ORD-9801", "SUSPEND_ACCOUNTS", 96, "DECISION_AGENT", "1.0.0", payload_h1, genesis_hash, b1_hash))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_database()
    print("Database successfully seeded with demo users, collusion scenarios, appeals, and cryptographic audit logs!")
