"""
Brevo (Sendinblue) Email Service using HTTP API.
More reliable than SMTP for cloud deployments like Render.
"""

import requests
from typing import List, Optional, Dict, Any
from loguru import logger

from app.core.config import settings


class BrevoEmailService:
    """Professional email service using Brevo HTTP API."""
    
    def __init__(self):
        self.api_key = getattr(settings, 'BREVO_API_KEY', None)
        self.api_url = "https://api.brevo.com/v3/smtp/email"
        self.from_email = getattr(settings, 'BREVO_FROM_EMAIL', 'noreply@vijetha.com')
        self.from_name = getattr(settings, 'BREVO_FROM_NAME', 'Vijetha Digital')
        
        # Brand colors from your theme
        self.brand_colors = {
            'primary': '#1A2332',      # brand-navy
            'accent': '#C0392B',       # brand-orange (vermillion)
            'accent_hover': '#A93226', # brand-orange-2
            'background': '#F8F7F4',   # warm-white
            'surface': '#FFFFFF',
            'text': '#0F1923',         # text-primary
            'text_muted': '#64748B',   # text-secondary
        }
        
    def _get_email_template(self, content_html: str) -> str:
        """Wrap content in minimal, aesthetic branded template."""
        return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Vijetha Digital</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {{font-family: Arial, Helvetica, sans-serif !important;}}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: {self.brand_colors['background']}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    
    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: {self.brand_colors['background']};">
        <tr>
            <td style="padding: 40px 20px;">
                
                <!-- Main Content Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: {self.brand_colors['surface']}; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Minimal Header -->
                    <tr>
                        <td style="background-color: {self.brand_colors['primary']}; padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">
                                VIJETHA DIGITAL
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">
                                Professional Printing
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content Area -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            {content_html}
                        </td>
                    </tr>
                    
                    <!-- Minimal Footer -->
                    <tr>
                        <td style="background-color: {self.brand_colors['background']}; padding: 32px 40px; text-align: center;">
                            
                            <!-- Contact Links -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="mailto:support@vijetha.com" style="display: inline-block; margin: 0 12px; color: {self.brand_colors['text']}; text-decoration: none; font-size: 13px; font-weight: 500;">
                                            Email
                                        </a>
                                        <span style="color: {self.brand_colors['text_muted']};">•</span>
                                        <a href="https://wa.me/919876543210" style="display: inline-block; margin: 0 12px; color: {self.brand_colors['text']}; text-decoration: none; font-size: 13px; font-weight: 500;">
                                            WhatsApp
                                        </a>
                                        <span style="color: {self.brand_colors['text_muted']};">•</span>
                                        <a href="{settings.FRONTEND_URL}" style="display: inline-block; margin: 0 12px; color: {self.brand_colors['text']}; text-decoration: none; font-size: 13px; font-weight: 500;">
                                            Website
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Copyright -->
                            <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 12px; line-height: 1.6;">
                                © 2026 Vijetha Digital. All rights reserved.
                            </p>
                            
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
        """
    
    def _create_button(self, text: str, url: str) -> str:
        """Create a minimal, elegant CTA button."""
        return f"""
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="text-align: center; padding: 32px 0;">
                    <a href="{url}" style="display: inline-block; background-color: {self.brand_colors['accent']}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px; transition: all 0.2s;">
                        {text}
                    </a>
                </td>
            </tr>
        </table>
        """
    
    def _create_info_box(self, title: str, items: List[tuple]) -> str:
        """Create a minimal, clean information box."""
        rows = ""
        for i, (key, value) in enumerate(items):
            border_style = "" if i == len(items) - 1 else "border-bottom: 1px solid #F2F1ED;"
            rows += f"""
            <tr>
                <td style="padding: 16px 0; {border_style}">
                    <span style="color: {self.brand_colors['text_muted']}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">{key}</span>
                </td>
                <td style="padding: 16px 0; {border_style} text-align: right;">
                    <span style="color: {self.brand_colors['text']}; font-size: 15px; font-weight: 600;">{value}</span>
                </td>
            </tr>
            """
        
        return f"""
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: {self.brand_colors['background']}; border-radius: 8px; padding: 24px; margin: 32px 0;">
            <tr>
                <td colspan="2" style="padding-bottom: 20px;">
                    <h3 style="margin: 0; color: {self.brand_colors['primary']}; font-size: 16px; font-weight: 700; letter-spacing: -0.3px;">
                        {title}
                    </h3>
                </td>
            </tr>
            {rows}
        </table>
        """
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        to_name: Optional[str] = None,
        reply_to: Optional[str] = None,
    ) -> bool:
        """Send email via Brevo API."""
        if not self.api_key:
            logger.warning("Brevo API key not configured, skipping email")
            return False
            
        headers = {
            "accept": "application/json",
            "api-key": self.api_key,
            "content-type": "application/json",
        }
        
        # Wrap content in template
        full_html = self._get_email_template(html_content)
        
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
            "htmlContent": full_html,
        }
        
        if reply_to:
            payload["replyTo"] = {"email": reply_to}
        
        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30,
            )
            
            if response.status_code == 201:
                logger.info(f"✅ Email sent successfully to {to_email}")
                return True
            else:
                logger.error(
                    f"❌ Failed to send email to {to_email}: "
                    f"Status {response.status_code}, Response: {response.text}"
                )
                return False
                
        except Exception as e:
            logger.error(f"❌ Error sending email to {to_email}: {str(e)}")
            return False
    
    def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """Send welcome email to new user."""
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Welcome, {user_name}
        </h2>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Thank you for joining Vijetha Digital. We're here to bring your printing projects to life with professional quality and fast delivery.
        </p>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
            <tr>
                <td style="padding: 20px 0; border-top: 1px solid #F2F1ED;">
                    <p style="margin: 0 0 8px 0; color: {self.brand_colors['text']}; font-size: 15px; font-weight: 600;">
                        Browse Products
                    </p>
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 14px; line-height: 1.6;">
                        Explore our catalog of business cards, flyers, banners, and more
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 0; border-top: 1px solid #F2F1ED;">
                    <p style="margin: 0 0 8px 0; color: {self.brand_colors['text']}; font-size: 15px; font-weight: 600;">
                        Get Instant Quotes
                    </p>
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 14px; line-height: 1.6;">
                        Upload your design and receive pricing in seconds
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 0; border-top: 1px solid #F2F1ED; border-bottom: 1px solid #F2F1ED;">
                    <p style="margin: 0 0 8px 0; color: {self.brand_colors['text']}; font-size: 15px; font-weight: 600;">
                        Track Orders
                    </p>
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 14px; line-height: 1.6;">
                        Monitor your order status from printing to delivery
                    </p>
                </td>
            </tr>
        </table>
        
        {self._create_button('Start Exploring', f'{settings.FRONTEND_URL}/products')}
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"Welcome to Vijetha Digital",
            html_content=content,
            to_name=user_name,
        )
    
    def send_order_confirmation(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        order_total: float,
        items_count: int = 1,
    ) -> bool:
        """Send order confirmation email."""
        info_box = self._create_info_box("Order Details", [
            ("Order ID", f"#{order_id}"),
            ("Items", str(items_count)),
            ("Total", f"₹{order_total:,.2f}"),
            ("Status", "Confirmed"),
        ])
        
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Order Confirmed
        </h2>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi {user_name}, thank you for your order. We've received it and will start processing shortly.
        </p>
        
        {info_box}
        
        {self._create_button('Track Order', f'{settings.FRONTEND_URL}/orders/{order_id}')}
        
        <p style="margin: 32px 0 0 0; padding: 20px; background-color: {self.brand_colors['background']}; border-radius: 6px; color: {self.brand_colors['text_muted']}; font-size: 14px; line-height: 1.6;">
            We'll notify you when your order ships with tracking information.
        </p>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"Order #{order_id} Confirmed",
            html_content=content,
            to_name=user_name,
        )
    
    def send_order_shipped(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        tracking_number: str,
        tracking_url: Optional[str] = None,
    ) -> bool:
        """Send order shipped notification."""
        tracking_info = [
            ("Order ID", f"#{order_id}"),
            ("Tracking Number", f"<strong>{tracking_number}</strong>"),
            ("Status", "<span style='color: #10B981;'>🚚 Shipped</span>"),
        ]
        
        info_box = self._create_info_box("Shipping Details", tracking_info)
        
        track_button = ""
        if tracking_url:
            track_button = self._create_button('Track Shipment', tracking_url)
        
        content = f"""
        <h2 style="margin: 0 0 16px 0; color: {self.brand_colors['primary']}; font-size: 28px; font-weight: 700;">
            Your Order Has Shipped! 🚚
        </h2>
        
        <p style="margin: 0 0 16px 0; color: {self.brand_colors['text']}; font-size: 16px; line-height: 1.6;">
            Hi <strong>{user_name}</strong>,
        </p>
        
        <p style="margin: 0 0 24px 0; color: {self.brand_colors['text']}; font-size: 16px; line-height: 1.6;">
            Great news! Your order is on its way and should arrive within <strong>3-5 business days</strong>.
        </p>
        
        {info_box}
        
        {track_button}
        
        <p style="margin: 24px 0 0 0; color: {self.brand_colors['text_muted']}; font-size: 14px; line-height: 1.6;">
            We'll notify you once your order is delivered.
        </p>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"Order Shipped - #{order_id} 🚚",
            html_content=content,
            to_name=user_name,
        )
    
    def send_order_shipped(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        tracking_number: str,
        tracking_url: Optional[str] = None,
    ) -> bool:
        """Send order shipped notification."""
        info_box = self._create_info_box("Shipping Details", [
            ("Order ID", f"#{order_id}"),
            ("Tracking", tracking_number),
            ("Status", "Shipped"),
            ("Delivery", "3-5 business days"),
        ])
        
        track_button = ""
        if tracking_url:
            track_button = self._create_button('Track Shipment', tracking_url)
        
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Order Shipped
        </h2>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi {user_name}, your order is on its way. Expected delivery within 3-5 business days.
        </p>
        
        {info_box}
        
        {track_button}
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"Order #{order_id} Shipped",
            html_content=content,
            to_name=user_name,
        )
    
    def send_password_reset(
        self,
        to_email: str,
        user_name: str,
        reset_token: str,
    ) -> bool:
        """Send password reset email."""
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Reset Password
        </h2>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi {user_name}, we received a request to reset your password. Click below to create a new one.
        </p>
        
        {self._create_button('Reset Password', reset_url)}
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
            <tr>
                <td style="padding: 20px; background-color: #FEF3C7; border-radius: 6px; border-left: 3px solid #F59E0B;">
                    <p style="margin: 0; color: #92400E; font-size: 13px; line-height: 1.6;">
                        <strong>Security Notice:</strong> This link expires in 1 hour. If you didn't request this, please ignore this email.
                    </p>
                </td>
            </tr>
        </table>
        
        <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 12px; line-height: 1.6;">
            If the button doesn't work, copy this link:<br>
            <a href="{reset_url}" style="color: {self.brand_colors['accent']}; word-break: break-all; text-decoration: none;">{reset_url}</a>
        </p>
        """
        
        return self.send_email(
            to_email=to_email,
            subject="Reset Your Password",
            html_content=content,
            to_name=user_name,
        )
    
    def send_payment_success(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        amount: float,
        payment_id: str,
    ) -> bool:
        """Send payment success confirmation."""
        info_box = self._create_info_box("Payment Details", [
            ("Order ID", f"#{order_id}"),
            ("Amount", f"₹{amount:,.2f}"),
            ("Payment ID", payment_id),
            ("Status", "Successful"),
        ])
        
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Payment Successful
        </h2>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi {user_name}, your payment has been processed successfully. Thank you for your business.
        </p>
        
        {info_box}
        
        {self._create_button('View Order', f'{settings.FRONTEND_URL}/orders/{order_id}')}
        
        <p style="margin: 32px 0 0 0; padding: 20px; background-color: {self.brand_colors['background']}; border-radius: 6px; color: {self.brand_colors['text_muted']}; font-size: 14px; line-height: 1.6;">
            A receipt is available in your order details.
        </p>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"Payment Successful - Order #{order_id}",
            html_content=content,
            to_name=user_name,
        )


# Singleton instance
brevo_email_service = BrevoEmailService()
