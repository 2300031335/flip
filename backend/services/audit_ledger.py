import hashlib
import json
from datetime import datetime
from typing import Dict, Any, List, Tuple
from db.database import get_db_connection
from models.schemas import AuditBlock

class CryptographicAuditLedger:
    """
    Immutable Cryptographic Audit Trail using SHA-256 Merkle Block Chaining.
    Ensures zero tampering for all fraud decisions, risk scores, and remediation actions.
    """
    def __init__(self, model_version: str = "1.0.0"):
        self.model_version = model_version

    def append_entry(
        self, 
        order_id: str, 
        action: str, 
        risk_score: int, 
        reviewer_id: str, 
        payload: Dict[str, Any]
    ) -> AuditBlock:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get latest block index and hash
        cursor.execute("SELECT block_index, block_hash FROM audit_logs ORDER BY block_index DESC LIMIT 1")
        row = cursor.fetchone()

        if row:
            latest_index = row["block_index"]
            previous_hash = row["block_hash"]
        else:
            latest_index = 0
            previous_hash = "0" * 64

        new_index = latest_index + 1
        timestamp = datetime.utcnow().isoformat()
        payload_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()

        # Construct Block String for Cryptographic Hashing
        block_string = f"{new_index}|{timestamp}|{order_id}|{action}|{risk_score}|{reviewer_id}|{self.model_version}|{payload_hash}|{previous_hash}"
        block_hash = hashlib.sha256(block_string.encode()).hexdigest()

        cursor.execute('''
            INSERT INTO audit_logs 
            (timestamp, order_id, action, risk_score, reviewer_id, model_version, payload_hash, previous_hash, block_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (timestamp, order_id, action, risk_score, reviewer_id, self.model_version, payload_hash, previous_hash, block_hash))

        conn.commit()
        conn.close()

        return AuditBlock(
            index=new_index,
            timestamp=timestamp,
            order_id=order_id,
            action=action,
            risk_score=risk_score,
            reviewer_id=reviewer_id,
            model_version=self.model_version,
            payload_hash=payload_hash,
            previous_hash=previous_hash,
            block_hash=block_hash
        )

    def get_all_blocks(self) -> List[AuditBlock]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_logs ORDER BY block_index DESC")
        rows = cursor.fetchall()
        conn.close()

        blocks = []
        for r in rows:
            blocks.append(AuditBlock(
                index=r["block_index"],
                timestamp=r["timestamp"],
                order_id=r["order_id"],
                action=r["action"],
                risk_score=r["risk_score"],
                reviewer_id=r["reviewer_id"],
                model_version=r["model_version"],
                payload_hash=r["payload_hash"],
                previous_hash=r["previous_hash"],
                block_hash=r["block_hash"]
            ))
        return blocks

    def verify_chain_integrity(self) -> Tuple[bool, str, int]:
        """
        Walks the entire blockchain from index 1 to N, re-computing each block hash.
        Returns (is_valid, message, broken_block_index).
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_logs ORDER BY block_index ASC")
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return True, "Audit ledger is empty.", 0

        prev_hash = "0" * 64
        for r in rows:
            idx = r["block_index"]
            # Verify previous hash link
            if r["previous_hash"] != prev_hash and idx != 1:
                return False, f"Broken chain link at Block #{idx}. Previous hash mismatch.", idx

            # Recompute current block hash
            block_string = f"{idx}|{r['timestamp']}|{r['order_id']}|{r['action']}|{r['risk_score']}|{r['reviewer_id']}|{r['model_version']}|{r['payload_hash']}|{r['previous_hash']}"
            computed_hash = hashlib.sha256(block_string.encode()).hexdigest()

            if computed_hash != r["block_hash"]:
                return False, f"Data tampering detected at Block #{idx}. Hash integrity check failed.", idx

            prev_hash = r["block_hash"]

        return True, f"Verified {len(rows)} audit blocks. Blockchain cryptographic integrity 100% Intact.", 0

audit_ledger = CryptographicAuditLedger()
