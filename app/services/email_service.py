"""
Email service — send emails with templates and background task support.
"""
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Optional

from app.core.config import settings


def send_email(to_email: str, subject: str, html_content: str) -> None:
    """
    Send an email with HTML content.
    Raises RuntimeError if SMTP is not configured or sending fails.
    """
    SMTP_HOST = settings.SMTP_HOST
    SMTP_PORT = settings.SMTP_PORT
    SMTP_USER = settings.SMTP_USER
    SMTP_PASSWORD = settings.SMTP_PASSWORD

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        raise RuntimeError("SMTP credentials not configured properly")

    # Remove accidental spaces
    SMTP_USER = SMTP_USER.strip()
    SMTP_PASSWORD = SMTP_PASSWORD.strip()

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20)
        server.ehlo()
        server.starttls()
        server.ehlo()

        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)

    except smtplib.SMTPAuthenticationError as e:
        raise RuntimeError(f"SMTP authentication failed: {str(e)}")

    except Exception as e:
        raise RuntimeError(f"Email sending failed: {str(e)}")

    finally:
        if "server" in locals():
            server.quit()


# ── Email Templates ───────────────────────────────────────────────────

def render_template(template_name: str, context: Dict[str, str]) -> str:
    """
    Render an email template with context variables.
    Simple string replacement for now. Can be upgraded to Jinja2.
    """
    templates = {
        "welcome": """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Welcome to {app_name}!</h2>
            <p>Hi {user_name},</p>
            <p>Thank you for registering with us. We're excited to have you on board!</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>{app_name} Team</p>
        </body>
        </html>
        """,
        
        "password_reset": """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Password Reset Request</h2>
            <p>Hi {user_name},</p>
            <p>You requested to reset your password. Your OTP code is:</p>
            <h3 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">{otp_code}</h3>
            <p>This code will expire in {expiry_minutes} minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>{app_name} Team</p>
        </body>
        </html>
        """,
        
        "order_confirmation": """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Order Confirmation</h2>
            <p>Hi {user_name},</p>
            <p>Thank you for your order! Your order #{order_id} has been confirmed.</p>
            <p><strong>Order Total:</strong> ₹{order_total}</p>
            <p>We'll notify you once your order is shipped.</p>
            <p>Best regards,<br>{app_name} Team</p>
        </body>
        </html>
        """,
        
        "order_shipped": """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Your Order Has Been Shipped!</h2>
            <p>Hi {user_name},</p>
            <p>Great news! Your order #{order_id} has been shipped.</p>
            <p><strong>Tracking Number:</strong> {tracking_number}</p>
            <p><strong>Tracking URL:</strong> <a href="{tracking_url}">{tracking_url}</a></p>
            <p>Expected delivery: {expected_delivery}</p>
            <p>Best regards,<br>{app_name} Team</p>
        </body>
        </html>
        """,
        
        "business_verification_approved": """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Business Account Approved!</h2>
            <p>Hi {user_name},</p>
            <p>Congratulations! Your business account for <strong>{company_name}</strong> has been verified and approved.</p>
            <p><strong>Credit Limit:</strong> ₹{credit_limit}</p>
            <p><strong>Payment Terms:</strong> {payment_terms_days} days</p>
            <p><strong>Discount:</strong> {discount_percentage}%</p>
            <p>You can now enjoy business pricing and credit terms.</p>
            <p>Best regards,<br>{app_name} Team</p>
        </body>
        </html>
        """,
        
        "business_verification_rejected": """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Business Account Verification Update</h2>
            <p>Hi {user_name},</p>
            <p>We regret to inform you that your business account verification for <strong>{company_name}</strong> could not be completed at this time.</p>
            <p><strong>Reason:</strong> {rejection_reason}</p>
            <p>Please contact our support team if you have any questions or would like to resubmit your application.</p>
            <p>Best regards,<br>{app_name} Team</p>
        </body>
        </html>
        """,
    }
    
    template = templates.get(template_name, "")
    if not template:
        raise ValueError(f"Template '{template_name}' not found")
    
    # Simple string replacement
    for key, value in context.items():
        template = template.replace(f"{{{key}}}", str(value))
    
    return template


def send_welcome_email(to_email: str, user_name: str) -> None:
    """Send welcome email to new user."""
    html = render_template("welcome", {
        "app_name": settings.APP_NAME,
        "user_name": user_name,
    })
    send_email(to_email, f"Welcome to {settings.APP_NAME}!", html)


def send_password_reset_email(to_email: str, user_name: str, otp_code: str, expiry_minutes: int = 10) -> None:
    """Send password reset OTP email."""
    html = render_template("password_reset", {
        "app_name": settings.APP_NAME,
        "user_name": user_name,
        "otp_code": otp_code,
        "expiry_minutes": str(expiry_minutes),
    })
    send_email(to_email, "Password Reset Request", html)


def send_order_confirmation_email(to_email: str, user_name: str, order_id: int, order_total: float) -> None:
    """Send order confirmation email."""
    html = render_template("order_confirmation", {
        "app_name": settings.APP_NAME,
        "user_name": user_name,
        "order_id": str(order_id),
        "order_total": f"{order_total:.2f}",
    })
    send_email(to_email, f"Order Confirmation #{order_id}", html)


def send_order_shipped_email(
    to_email: str,
    user_name: str,
    order_id: int,
    tracking_number: str,
    tracking_url: str,
    expected_delivery: str = "3-5 business days",
) -> None:
    """Send order shipped notification email."""
    html = render_template("order_shipped", {
        "app_name": settings.APP_NAME,
        "user_name": user_name,
        "order_id": str(order_id),
        "tracking_number": tracking_number,
        "tracking_url": tracking_url,
        "expected_delivery": expected_delivery,
    })
    send_email(to_email, f"Your Order #{order_id} Has Shipped!", html)


def send_business_approved_email(
    to_email: str,
    user_name: str,
    company_name: str,
    credit_limit: float,
    payment_terms_days: int,
    discount_percentage: float,
) -> None:
    """Send business verification approved email."""
    html = render_template("business_verification_approved", {
        "app_name": settings.APP_NAME,
        "user_name": user_name,
        "company_name": company_name,
        "credit_limit": f"{credit_limit:.2f}",
        "payment_terms_days": str(payment_terms_days),
        "discount_percentage": f"{discount_percentage:.1f}",
    })
    send_email(to_email, "Business Account Approved!", html)


def send_business_rejected_email(
    to_email: str,
    user_name: str,
    company_name: str,
    rejection_reason: str,
) -> None:
    """Send business verification rejected email."""
    html = render_template("business_verification_rejected", {
        "app_name": settings.APP_NAME,
        "user_name": user_name,
        "company_name": company_name,
        "rejection_reason": rejection_reason,
    })
    send_email(to_email, "Business Account Verification Update", html)
