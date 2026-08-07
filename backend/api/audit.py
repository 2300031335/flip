from fastapi import APIRouter
from typing import List, Dict, Any
from services.audit_ledger import audit_ledger
from models.schemas import AuditBlock

router = APIRouter(prefix="/audit", tags=["Cryptographic Audit Ledger"])

@router.get("/blocks", response_model=List[AuditBlock])
def get_audit_blocks():
    return audit_ledger.get_all_blocks()

@router.get("/verify")
def verify_audit_chain():
    is_valid, message, broken_index = audit_ledger.verify_chain_integrity()
    return {
        "is_valid": is_valid,
        "message": message,
        "broken_block_index": broken_index,
        "algorithm": "SHA-256 Merkle Block Hash Chaining"
    }
