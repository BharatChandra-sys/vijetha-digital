"""
Email service using Brevo (Sendinblue) HTTP API.
More reliable than SMTP for serverless/cloud deployments.
"""

from typing import Any

import httpx
from loguru import logger

from app.core.config import settings


class BrevoEmailService:
    """Email service using Brevo HTTP API."""

    def __init__(self):
        self.api_key = settings.BREVO_API_KEY
        self.api_url = "https://api.brevo.com/v3/smtp/email"
        self.from_email = settings.BREVO_FROM_EMAIL
        self.from_name = settings.BREVO_FROM_NAME

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        to_name: str | None = None,
        reply_to: str | None = None,
        cc: list[str] | None = None,
        bcc: list[str] | None = None,
        attachments: list[dict[str, Any]] | None = None,
    ) -> bool:
        """
        Send email via Brevo API.

        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML content of email
            to_name: Recipient name (optional)
            reply_to: Reply-to email (optional)
            cc: CC recipients (optional)
            bcc: BCC recipients (optional)
            attachments: List of attachments (optional)

        Returns:
            bool: True if sent successfully, False otherwise
        """
        if not self.api_key:
            logger.warning("Brevo API key not configured, skipping email")
            return False

        headers = {
            "accept": "application/json",
            "api-key": self.api_key,
            "content-type": "application/json",
        }

        payload = {
            "sender": {
                "name": self.from_name,
                "email": self.from_email,
            },
            "to": [
                {
                    "email": to_email,
                    "name": to_name or to_email,
                }
            ],
            "subject": subject,
            "htmlContent": html_content,
        }

        # Add optional fields
        if reply_to:
            payload["replyTo"] = {"email": reply_to}

        if cc:
            payload["cc"] = [{"email": email} for email in cc]

        if bcc:
            payload["bcc"] = [{"email": email} for email in bcc]

        if attachments:
            payload["attachment"] = attachments

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload,
                )

                if response.status_code == 201:
                    logger.info(f"Email sent successfully to {to_email}")
                    return True
                else:
                    logger.error(
                        f"Failed to send email to {to_email}: "
                        f"Status {response.status_code}, Response: {response.text}"
                    )
                    return False

        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {str(e)}")
            return False

    async def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """Send welcome email to new user."""
        subject = f"Welcome to {settings.APP_NAME}!"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Welcome to Vijetha Digital!</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #667eea;">Hello {user_name}! 👋</h2>

                <p>Thank you for joining Vijetha Digital - your trusted partner for professional printing services.</p>

                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #667eea; margin-top: 0;">What's Next?</h3>
                    <ul style="padding-left: 20px;">
                        <li>Browse our product catalog</li>
                        <li>Get instant price quotes</li>
                        <li>Upload your designs</li>
                        <li>Track your orders in real-time</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{settings.FRONTEND_URL}/products"
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: white;
                              padding: 15px 30px;
                              text-decoration: none;
                              border-radius: 5px;
                              display: inline-block;
                              font-weight: bold;">
                        Explore Products
                    </a>
                </div>

                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    Need help? Contact us at <a href="mailto:support@vijetha.com" style="color: #667eea;">support@vijetha.com</a>
                </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p>&copy; 2026 Vijetha Digital. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            to_name=user_name,
        )

    async def send_order_confirmation(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        order_total: float,
    ) -> bool:
        """Send order confirmation email."""
        subject = f"Order Confirmation - #{order_id}"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Order Confirmed! ✅</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #667eea;">Hi {user_name},</h2>

                <p>Thank you for your order! We've received your order and will start processing it shortly.</p>

                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #667eea; margin-top: 0;">Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">#{order_id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">₹{order_total:.2f}</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{settings.FRONTEND_URL}/orders/{order_id}"
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: white;
                              padding: 15px 30px;
                              text-decoration: none;
                              border-radius: 5px;
                              display: inline-block;
                              font-weight: bold;">
                        Track Your Order
                    </a>
                </div>

                <p style="color: #666; font-size: 14px;">
                    We'll send you another email when your order ships.
                </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p>&copy; 2026 Vijetha Digital. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            to_name=user_name,
        )

    async def send_password_reset(
        self,
        to_email: str,
        user_name: str,
        reset_token: str,
    ) -> bool:
        """Send password reset email."""
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        subject = "Password Reset Request"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Password Reset</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #667eea;">Hi {user_name},</h2>

                <p>We received a request to reset your password. Click the button below to create a new password:</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}"
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: white;
                              padding: 15px 30px;
                              text-decoration: none;
                              border-radius: 5px;
                              display: inline-block;
                              font-weight: bold;">
                        Reset Password
                    </a>
                </div>

                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;">
                        <strong>⚠️ Security Notice:</strong><br>
                        This link will expire in 1 hour. If you didn't request this, please ignore this email.
                    </p>
                </div>

                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    If the button doesn't work, copy and paste this link:<br>
                    <a href="{reset_url}" style="color: #667eea; word-break: break-all;">{reset_url}</a>
                </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p>&copy; 2026 Vijetha Digital. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            to_name=user_name,
        )


# Singleton instance
email_service = BrevoEmailService()
