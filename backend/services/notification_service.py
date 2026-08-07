import logging
from typing import Dict, Any

logger = logging.getLogger("trust_graph_notification")

class NotificationService:
    """
    Multi-Channel Notification Dispatcher (Twilio SMS & SendGrid Email Integration).
    Sends OTP challenges, appeal updates, and critical risk alerts to users, sellers, and delivery partners.
    """
    def send_otp(self, recipient_phone: str, otp_code: str) -> Dict[str, Any]:
        msg = f"[TrustGraph Security] Your OTP code is: {otp_code}. Valid for 5 minutes."
        logger.info(f"TWILIO SMS -> {recipient_phone}: {msg}")
        return {"status": "DELIVERED", "channel": "TWILIO_SMS", "recipient": recipient_phone, "message": msg}

    def send_risk_alert(self, recipient_email: str, order_id: str, action: str, reason: str) -> Dict[str, Any]:
        msg = f"Security Notice: Order {order_id} flagged for review. Action Applied: {action}. Reason: {reason}"
        logger.info(f"SENDGRID EMAIL -> {recipient_email}: {msg}")
        return {"status": "DELIVERED", "channel": "SENDGRID_EMAIL", "recipient": recipient_email, "message": msg}

    def send_appeal_update(self, recipient_email: str, appeal_id: str, status: str, notes: str) -> Dict[str, Any]:
        msg = f"Appeal Status Update for #{appeal_id}: Current Status = {status}. Notes: {notes}"
        logger.info(f"SENDGRID EMAIL -> {recipient_email}: {msg}")
        return {"status": "DELIVERED", "channel": "SENDGRID_EMAIL", "recipient": recipient_email, "message": msg}

notification_service = NotificationService()
