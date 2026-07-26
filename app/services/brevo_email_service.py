"""
Brevo (Sendinblue) Email Service using HTTP API.
Production-grade transactional emails with Apple/Amazon-level design quality.
"""

import requests
from typing import List, Optional, Dict, Any
from loguru import logger

from app.core.config import settings


class BrevoEmailService:
    """Enterprise email service with production-grade templates."""
    
    def __init__(self):
        self.api_key = getattr(settings, 'BREVO_API_KEY', None)
        self.api_url = "https://api.brevo.com/v3/smtp/email"
        self.from_email = getattr(settings, 'BREVO_FROM_EMAIL', 'noreply@vijetha.com')
        self.from_name = getattr(settings, 'BREVO_FROM_NAME', 'Vijetha Digital')
        
        # Production color palette - minimal and sophisticated
        self.colors = {
            'navy': '#1A2332',
            'text': '#1d1d1f',        # Apple-style near-black
            'text_light': '#6e6e73',  # Apple-style gray
            'border': '#d2d2d7',      # Subtle borders
            'bg': '#f5f5f7',          # Apple-style light bg
            'white': '#ffffff',
            'accent': '#C0392B',      # Brand vermillion
        }
        
    def _get_base_template(self, content_html: str) -> str:
        """Minimalist email template - Apple/Amazon inspired. Text-only header for maximum compatibility."""
        
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Vijetha Digital</title>
</head>
<body style="margin:0;padding:0;background-color:{self.colors['bg']};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:{self.colors['bg']};">
        <tr>
            <td style="padding:40px 16px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:{self.colors['white']};">
                    
                    <!-- Minimalist text header -->
                    <tr>
                        <td style="padding:48px 48px 40px 48px;text-align:center;border-bottom:1px solid {self.colors['border']};">
                            <h2 style="margin:0;color:{self.colors['navy']};font-size:16px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">VIJETHA DIGITAL</h2>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding:48px 48px 48px 48px;">
                            {content_html}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding:32px 48px 48px 48px;border-top:1px solid {self.colors['border']};">
                            <p style="margin:0 0 12px 0;color:{self.colors['text_light']};font-size:13px;line-height:1.5;text-align:center;">
                                Vijetha Digital · Professional Printing Solutions
                            </p>
                            <p style="margin:0;text-align:center;">
                                <a href="mailto:contact@vijethadigital.com" style="color:{self.colors['text_light']};font-size:13px;text-decoration:none;margin:0 8px;">Contact</a>
                                <span style="color:{self.colors['border']};">·</span>
                                <a href="{settings.FRONTEND_URL}" style="color:{self.colors['text_light']};font-size:13px;text-decoration:none;margin:0 8px;">Website</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""
    
    def _button(self, text: str, url: str) -> str:
        """Production-grade button - Amazon-style."""
        return f"""<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
        <td style="padding:32px 0;">
            <a href="{url}" style="display:inline-block;background-color:{self.colors['navy']};color:{self.colors['white']};padding:14px 28px;text-decoration:none;border-radius:4px;font-weight:500;font-size:15px;letter-spacing:-0.01em;">{text}</a>
        </td>
    </tr>
</table>"""
    
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
            logger.warning("Brevo API key not configured")
            return False
            
        headers = {
            "accept": "application/json",
            "api-key": self.api_key,
            "content-type": "application/json",
        }
        
        full_html = self._get_base_template(html_content)
        
        payload = {
            "sender": {"name": self.from_name, "email": self.from_email},
            "to": [{"email": to_email, "name": to_name or to_email}],
            "subject": subject,
            "htmlContent": full_html,
        }
        
        if reply_to:
            payload["replyTo"] = {"email": reply_to}
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 201:
                logger.info(f"✅ Email sent to {to_email}")
                return True
            else:
                logger.error(f"❌ Email failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Email error: {str(e)}")
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
        order_items: List[Dict[str, Any]] = None,
    ) -> bool:
        """Send enterprise-level order confirmation email with full order details."""
        
        # Build order items table
        items_html = ""
        if order_items:
            rows = ""
            for item in order_items:
                product_name = item.get('product_name', 'Product')
                quantity = item.get('quantity', 1)
                price = item.get('price', 0.0)
                total = quantity * price
                
                rows += f"""
                <tr>
                    <td style="padding: 16px 0; border-bottom: 1px solid #F2F1ED;">
                        <span style="color: {self.brand_colors['text']}; font-size: 15px; font-weight: 600;">{product_name}</span>
                    </td>
                    <td style="padding: 16px 0; border-bottom: 1px solid #F2F1ED; text-align: center;">
                        <span style="color: {self.brand_colors['text_muted']}; font-size: 14px;">×{quantity}</span>
                    </td>
                    <td style="padding: 16px 0; border-bottom: 1px solid #F2F1ED; text-align: right;">
                        <span style="color: {self.brand_colors['text']}; font-size: 14px;">₹{price:,.2f}</span>
                    </td>
                    <td style="padding: 16px 0; border-bottom: 1px solid #F2F1ED; text-align: right;">
                        <span style="color: {self.brand_colors['text']}; font-size: 15px; font-weight: 600;">₹{total:,.2f}</span>
                    </td>
                </tr>
                """
            
            items_html = f"""
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                    <td colspan="4" style="padding-bottom: 16px;">
                        <h3 style="margin: 0; color: {self.brand_colors['primary']}; font-size: 16px; font-weight: 700; letter-spacing: -0.3px;">
                            Order Items
                        </h3>
                    </td>
                </tr>
                <tr>
                    <th style="padding: 12px 0; border-bottom: 2px solid {self.brand_colors['primary']}; text-align: left;">
                        <span style="color: {self.brand_colors['text_muted']}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Product</span>
                    </th>
                    <th style="padding: 12px 0; border-bottom: 2px solid {self.brand_colors['primary']}; text-align: center;">
                        <span style="color: {self.brand_colors['text_muted']}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</span>
                    </th>
                    <th style="padding: 12px 0; border-bottom: 2px solid {self.brand_colors['primary']}; text-align: right;">
                        <span style="color: {self.brand_colors['text_muted']}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Price</span>
                    </th>
                    <th style="padding: 12px 0; border-bottom: 2px solid {self.brand_colors['primary']}; text-align: right;">
                        <span style="color: {self.brand_colors['text_muted']}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Total</span>
                    </th>
                </tr>
                {rows}
                <tr>
                    <td colspan="3" style="padding: 20px 0 0 0; text-align: right;">
                        <span style="color: {self.brand_colors['text']}; font-size: 16px; font-weight: 700;">Order Total:</span>
                    </td>
                    <td style="padding: 20px 0 0 0; text-align: right;">
                        <span style="color: {self.brand_colors['accent']}; font-size: 20px; font-weight: 700;">₹{order_total:,.2f}</span>
                    </td>
                </tr>
            </table>
            """
        
        info_box = self._create_info_box("Order Summary", [
            ("Order ID", f"#{order_id}"),
            ("Items", str(items_count)),
            ("Total Amount", f"₹{order_total:,.2f}"),
            ("Status", "<span style='color: #10B981;'>✓ Confirmed</span>"),
            ("Payment", "<span style='color: #10B981;'>✓ Successful</span>"),
        ])
        
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Order Confirmed
        </h2>
        
        <p style="margin: 0 0 8px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi <strong>{user_name}</strong>,
        </p>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Thank you for your order! We've received your payment and will start processing your order shortly. You'll receive tracking information once it ships.
        </p>
        
        {info_box}
        
        {items_html}
        
        {self._create_button('Track Your Order', f'{settings.FRONTEND_URL}/orders/{order_id}')}
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0 0 0;">
            <tr>
                <td style="padding: 24px; background-color: {self.brand_colors['background']}; border-radius: 8px; border-left: 3px solid {self.brand_colors['accent']};">
                    <p style="margin: 0 0 8px 0; color: {self.brand_colors['text']}; font-size: 14px; font-weight: 600;">
                        What's Next?
                    </p>
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 13px; line-height: 1.6;">
                        • Our team will review your order<br>
                        • You'll receive a shipping notification with tracking<br>
                        • Estimated delivery: 3-5 business days<br>
                        • Questions? Reply to this email or contact support
                    </p>
                </td>
            </tr>
        </table>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"✓ Order #{order_id} Confirmed - Vijetha Digital",
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
        expected_delivery: str = "3-5 business days",
    ) -> bool:
        """Send order shipped notification."""
        info_box = self._create_info_box("Shipping Details", [
            ("Order ID", f"#{order_id}"),
            ("Tracking", tracking_number),
            ("Status", "<span style='color: #10B981;'>🚚 Shipped</span>"),
            ("Expected Delivery", expected_delivery),
        ])
        
        track_button = ""
        if tracking_url:
            track_button = self._create_button('Track Shipment', tracking_url)
        
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Order Shipped
        </h2>
        
        <p style="margin: 0 0 8px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi <strong>{user_name}</strong>,
        </p>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Great news! Your order is on its way and should arrive within <strong>{expected_delivery}</strong>.
        </p>
        
        {info_box}
        
        {track_button}
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0 0 0;">
            <tr>
                <td style="padding: 24px; background-color: {self.brand_colors['background']}; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: {self.brand_colors['text']}; font-size: 14px; font-weight: 600;">
                        Track Your Delivery
                    </p>
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 13px; line-height: 1.6;">
                        Use your tracking number to monitor real-time delivery status. You'll receive a notification once your order is delivered.
                    </p>
                </td>
            </tr>
        </table>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"Order #{order_id} Shipped - Vijetha Digital",
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
            ("Status", "<span style='color: #10B981;'>✓ Successful</span>"),
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
            subject=f"✓ Payment Successful - Order #{order_id}",
            html_content=content,
            to_name=user_name,
        )
    
    def send_business_approved(
        self,
        to_email: str,
        user_name: str,
        company_name: str,
        credit_limit: float,
        payment_terms_days: int,
        discount_percentage: float,
    ) -> bool:
        """Send business verification approved email."""
        info_box = self._create_info_box("Business Account Details", [
            ("Company", company_name),
            ("Credit Limit", f"₹{credit_limit:,.2f}"),
            ("Payment Terms", f"{payment_terms_days} days"),
            ("Discount", f"{discount_percentage}%"),
            ("Status", "<span style='color: #10B981;'>✓ Approved</span>"),
        ])
        
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Business Account Approved
        </h2>
        
        <p style="margin: 0 0 8px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi <strong>{user_name}</strong>,
        </p>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Congratulations! Your business account for <strong>{company_name}</strong> has been approved. You now have access to exclusive business pricing, credit terms, and bulk order discounts.
        </p>
        
        {info_box}
        
        {self._create_button('View Business Dashboard', f'{settings.FRONTEND_URL}/business/dashboard')}
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0 0 0;">
            <tr>
                <td style="padding: 24px; background-color: {self.brand_colors['background']}; border-radius: 8px; border-left: 3px solid {self.brand_colors['accent']};">
                    <p style="margin: 0 0 8px 0; color: {self.brand_colors['text']}; font-size: 14px; font-weight: 600;">
                        What's Next?
                    </p>
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 13px; line-height: 1.6;">
                        • Access business pricing on all products<br>
                        • Enjoy {discount_percentage}% discount on bulk orders<br>
                        • Flexible payment terms up to {payment_terms_days} days<br>
                        • Dedicated account manager support
                    </p>
                </td>
            </tr>
        </table>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"✓ Business Account Approved - {company_name}",
            html_content=content,
            to_name=user_name,
        )
    
    def send_business_rejected(
        self,
        to_email: str,
        user_name: str,
        company_name: str,
        rejection_reason: str,
    ) -> bool:
        """Send business verification rejected email."""
        content = f"""
        <h2 style="margin: 0 0 12px 0; color: {self.brand_colors['primary']}; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
            Business Account Update
        </h2>
        
        <p style="margin: 0 0 8px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Hi <strong>{user_name}</strong>,
        </p>
        
        <p style="margin: 0 0 24px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            Thank you for your business account application for <strong>{company_name}</strong>. After reviewing your submission, we're unable to approve your account at this time.
        </p>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
            <tr>
                <td style="padding: 24px; background-color: #FEF3C7; border-radius: 8px; border-left: 3px solid #F59E0B;">
                    <p style="margin: 0 0 8px 0; color: #92400E; font-size: 14px; font-weight: 600;">
                        Reason for Decline
                    </p>
                    <p style="margin: 0; color: #92400E; font-size: 13px; line-height: 1.6;">
                        {rejection_reason}
                    </p>
                </td>
            </tr>
        </table>
        
        <p style="margin: 24px 0; color: {self.brand_colors['text_muted']}; font-size: 15px; line-height: 1.7;">
            You can still place orders with our standard retail pricing. If you'd like to reapply or discuss your application, please contact our business team.
        </p>
        
        {self._create_button('Contact Business Team', f'{settings.FRONTEND_URL}/contact')}
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0 0 0;">
            <tr>
                <td style="padding: 24px; background-color: {self.brand_colors['background']}; border-radius: 8px;">
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 13px; line-height: 1.6; text-align: center;">
                        Questions? Email us at <a href="mailto:business@vijetha.com" style="color: {self.brand_colors['accent']}; text-decoration: none;">business@vijetha.com</a>
                    </p>
                </td>
            </tr>
        </table>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=f"Business Account Update - {company_name}",
            html_content=content,
            to_name=user_name,
        )
    
    def send_otp_email(
        self,
        to_email: str,
        user_name: str,
        otp: str,
        expiry_minutes: int = 10,
    ) -> bool:
        """Send OTP email for password reset."""
        content = f"""
        <h2 style="margin: 0 0 16px 0; color: {self.brand_colors['primary']}; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
            Password Reset Request
        </h2>
        
        <p style="margin: 0 0 24px 0; color: {self.brand_colors['text']}; font-size: 15px; line-height: 1.6;">
            Hello {user_name},
        </p>
        
        <p style="margin: 0 0 32px 0; color: {self.brand_colors['text']}; font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Use the verification code below to proceed:
        </p>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px 0;">
            <tr>
                <td style="background-color: {self.brand_colors['background']}; border: 2px solid #E5E7EB; border-radius: 8px; padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; color: {self.brand_colors['text_muted']}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                        Verification Code
                    </p>
                    <p style="margin: 0; color: {self.brand_colors['primary']}; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                        {otp}
                    </p>
                </td>
            </tr>
        </table>
        
        <p style="margin: 0 0 24px 0; color: {self.brand_colors['text_muted']}; font-size: 14px; line-height: 1.6;">
            This code will expire in {expiry_minutes} minutes. If you didn't request a password reset, you can safely ignore this email.
        </p>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0 0 0; border-top: 1px solid #E5E7EB; padding-top: 24px;">
            <tr>
                <td>
                    <p style="margin: 0; color: {self.brand_colors['text_muted']}; font-size: 13px; line-height: 1.5;">
                        For security, this code can only be used once. If you need assistance, contact us at contact@vijethadigital.com
                    </p>
                </td>
            </tr>
        </table>
        """
        
        return self.send_email(
            to_email=to_email,
            subject="Password Reset Code - Vijetha Digital",
            html_content=content,
            to_name=user_name,
        )
    
    def send_otp_email(self, to_email: str, user_name: str, otp: str, expiry_minutes: int = 10) -> bool:
        """OTP email - Apple-inspired minimal design."""
        content = f"""<h1 style="margin:0 0 8px 0;color:{self.colors['text']};font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
    Verify your identity
</h1>

<p style="margin:0 0 32px 0;color:{self.colors['text_light']};font-size:17px;line-height:1.5;">
    Hello {user_name}, enter this code to reset your password:
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
        <td style="background-color:{self.colors['bg']};border:1px solid {self.colors['border']};border-radius:8px;padding:24px;text-align:center;">
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;letter-spacing:0.5px;">VERIFICATION CODE</p>
            <p style="margin:0;color:{self.colors['text']};font-size:32px;font-weight:600;letter-spacing:4px;font-family:'SF Mono',Monaco,'Courier New',monospace;">{otp}</p>
        </td>
    </tr>
</table>

<p style="margin:32px 0 0 0;color:{self.colors['text_light']};font-size:15px;line-height:1.5;">
    This code expires in {expiry_minutes} minutes. If you didn't request this code, you can safely ignore this email.
</p>

<p style="margin:32px 0 0 0;padding-top:24px;border-top:1px solid {self.colors['border']};color:{self.colors['text_light']};font-size:13px;line-height:1.5;">
    For security, this code can only be used once. Need help? Email <a href="mailto:contact@vijethadigital.com" style="color:{self.colors['text']};text-decoration:none;">contact@vijethadigital.com</a>
</p>"""
        
        return self.send_email(to_email, "Verify your identity", content, user_name)
    
    def send_order_confirmation(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        order_total: float,
        items_count: int = 1,
        order_items: List[Dict[str, Any]] = None,
    ) -> bool:
        """Order confirmation - Amazon-inspired transactional design."""
        
        # Build items table
        items_html = ""
        if order_items:
            rows = ""
            for item in order_items:
                name = item.get('product_name', 'Product')
                qty = item.get('quantity', 1)
                price = float(item.get('price', 0))
                total = qty * price
                
                rows += f"""<tr>
    <td style="padding:16px 0;border-bottom:1px solid {self.colors['border']};">
        <p style="margin:0 0 4px 0;color:{self.colors['text']};font-size:15px;font-weight:500;letter-spacing:-0.01em;">{name}</p>
        <p style="margin:0;color:{self.colors['text_light']};font-size:13px;">Qty: {qty}</p>
    </td>
    <td style="padding:16px 0;border-bottom:1px solid {self.colors['border']};text-align:right;vertical-align:top;">
        <p style="margin:0;color:{self.colors['text']};font-size:15px;font-weight:500;">₹{total:,.2f}</p>
    </td>
</tr>"""
            
            items_html = f"""<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:32px 0;">
    {rows}
    <tr>
        <td style="padding:20px 0 0 0;"><p style="margin:0;color:{self.colors['text']};font-size:17px;font-weight:600;">Total</p></td>
        <td style="padding:20px 0 0 0;text-align:right;"><p style="margin:0;color:{self.colors['text']};font-size:20px;font-weight:600;">₹{order_total:,.2f}</p></td>
    </tr>
</table>"""
        
        content = f"""<h1 style="margin:0 0 8px 0;color:{self.colors['text']};font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
    Order confirmed
</h1>

<p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:17px;line-height:1.5;">
    Thank you for your order, {user_name}.
</p>

<p style="margin:0 0 32px 0;color:{self.colors['text_light']};font-size:15px;">
    Order #{order_id}
</p>

{items_html}

{self._button('Track order', f'{settings.FRONTEND_URL}/orders/{order_id}')}

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:32px 0 0 0;padding:24px;background-color:{self.colors['bg']};border-radius:8px;">
    <tr>
        <td>
            <p style="margin:0 0 8px 0;color:{self.colors['text']};font-size:15px;font-weight:500;">What's next</p>
            <p style="margin:0;color:{self.colors['text_light']};font-size:14px;line-height:1.6;">
                We'll send you a shipping confirmation email with tracking information when your order ships. Questions? Reply to this email or contact <a href="mailto:contact@vijethadigital.com" style="color:{self.colors['text']};text-decoration:none;">contact@vijethadigital.com</a>
            </p>
        </td>
    </tr>
</table>"""
        
        return self.send_email(to_email, f"Order confirmed", content, user_name)
    
    def send_order_shipped(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        tracking_number: str,
        tracking_url: Optional[str] = None,
        expected_delivery: str = "3-5 business days",
    ) -> bool:
        """Order shipped notification."""
        
        track_button = ""
        if tracking_url:
            track_button = self._button('Track shipment', tracking_url)
        
        content = f"""<h1 style="margin:0 0 8px 0;color:{self.colors['text']};font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
    Your order has shipped
</h1>

<p style="margin:0 0 32px 0;color:{self.colors['text_light']};font-size:17px;line-height:1.5;">
    Hello {user_name}, your order is on its way.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;padding:24px;background-color:{self.colors['bg']};border-radius:8px;">
    <tr>
        <td>
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">ORDER NUMBER</p>
            <p style="margin:0 0 16px 0;color:{self.colors['text']};font-size:15px;">#{order_id}</p>
            
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">TRACKING NUMBER</p>
            <p style="margin:0 0 16px 0;color:{self.colors['text']};font-size:15px;font-family:'SF Mono',Monaco,'Courier New',monospace;">{tracking_number}</p>
            
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">EXPECTED DELIVERY</p>
            <p style="margin:0;color:{self.colors['text']};font-size:15px;">{expected_delivery}</p>
        </td>
    </tr>
</table>

{track_button}"""
        
        return self.send_email(to_email, f"Your order has shipped", content, user_name)
    
    def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """Welcome email - minimal and warm."""
        content = f"""<h1 style="margin:0 0 8px 0;color:{self.colors['text']};font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
    Welcome to Vijetha Digital
</h1>

<p style="margin:0 0 32px 0;color:{self.colors['text_light']};font-size:17px;line-height:1.5;">
    Hello {user_name}, we're glad you're here.
</p>

<p style="margin:0 0 32px 0;color:{self.colors['text']};font-size:15px;line-height:1.6;">
    Vijetha Digital is your partner for professional printing services. From business cards to large format banners, we deliver quality that makes an impression.
</p>

{self._button('Browse products', f'{settings.FRONTEND_URL}/products')}

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:32px 0 0 0;padding:24px;background-color:{self.colors['bg']};border-radius:8px;">
    <tr>
        <td>
            <p style="margin:0 0 8px 0;color:{self.colors['text']};font-size:15px;font-weight:500;">Need help getting started?</p>
            <p style="margin:0;color:{self.colors['text_light']};font-size:14px;line-height:1.6;">
                Our team is here to help. Email us at <a href="mailto:contact@vijethadigital.com" style="color:{self.colors['text']};text-decoration:none;">contact@vijethadigital.com</a>
            </p>
        </td>
    </tr>
</table>"""
        
        return self.send_email(to_email, "Welcome to Vijetha Digital", content, user_name)
    
    def send_business_approved(
        self,
        to_email: str,
        user_name: str,
        company_name: str,
        credit_limit: float,
        payment_terms_days: int,
        discount_percentage: float,
    ) -> bool:
        """Business account approved."""
        content = f"""<h1 style="margin:0 0 8px 0;color:{self.colors['text']};font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
    Your business account is approved
</h1>

<p style="margin:0 0 32px 0;color:{self.colors['text_light']};font-size:17px;line-height:1.5;">
    Congratulations {user_name}, {company_name} now has access to business pricing and terms.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;padding:24px;background-color:{self.colors['bg']};border-radius:8px;">
    <tr>
        <td>
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">CREDIT LIMIT</p>
            <p style="margin:0 0 16px 0;color:{self.colors['text']};font-size:17px;font-weight:500;">₹{credit_limit:,.2f}</p>
            
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">PAYMENT TERMS</p>
            <p style="margin:0 0 16px 0;color:{self.colors['text']};font-size:17px;font-weight:500;">{payment_terms_days} days net</p>
            
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">DISCOUNT</p>
            <p style="margin:0;color:{self.colors['text']};font-size:17px;font-weight:500;">{discount_percentage}% on all orders</p>
        </td>
    </tr>
</table>

{self._button('View account', f'{settings.FRONTEND_URL}/business/dashboard')}"""
        
        return self.send_email(to_email, "Business account approved", content, user_name)
    
    def send_business_rejected(
        self,
        to_email: str,
        user_name: str,
        company_name: str,
        rejection_reason: str,
    ) -> bool:
        """Business account declined."""
        content = f"""<h1 style="margin:0 0 8px 0;color:{self.colors['text']};font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
    Business account update
</h1>

<p style="margin:0 0 32px 0;color:{self.colors['text_light']};font-size:17px;line-height:1.5;">
    Hello {user_name}, we've reviewed your application for {company_name}.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;padding:24px;background-color:{self.colors['bg']};border-radius:8px;">
    <tr>
        <td>
            <p style="margin:0 0 8px 0;color:{self.colors['text']};font-size:15px;font-weight:500;">Unable to approve at this time</p>
            <p style="margin:0;color:{self.colors['text_light']};font-size:14px;line-height:1.6;">{rejection_reason}</p>
        </td>
    </tr>
</table>

<p style="margin:0 0 32px 0;color:{self.colors['text']};font-size:15px;line-height:1.6;">
    You can continue placing orders with standard pricing. To discuss your application, email us at <a href="mailto:contact@vijethadigital.com" style="color:{self.colors['text']};text-decoration:none;">contact@vijethadigital.com</a>
</p>"""
        
        return self.send_email(to_email, "Business account update", content, user_name)
    
    def send_password_reset(self, to_email: str, user_name: str, reset_token: str) -> bool:
        """Legacy password reset - redirects to OTP."""
        return self.send_otp_email(to_email, user_name, reset_token, 60)
    
    def send_payment_success(
        self,
        to_email: str,
        user_name: str,
        order_id: str,
        amount: float,
        payment_id: str,
    ) -> bool:
        """Payment confirmation."""
        content = f"""<h1 style="margin:0 0 8px 0;color:{self.colors['text']};font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
    Payment received
</h1>

<p style="margin:0 0 32px 0;color:{self.colors['text_light']};font-size:17px;line-height:1.5;">
    Thank you {user_name}, your payment has been processed.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;padding:24px;background-color:{self.colors['bg']};border-radius:8px;">
    <tr>
        <td>
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">AMOUNT PAID</p>
            <p style="margin:0 0 16px 0;color:{self.colors['text']};font-size:20px;font-weight:600;">₹{amount:,.2f}</p>
            
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">ORDER NUMBER</p>
            <p style="margin:0 0 16px 0;color:{self.colors['text']};font-size:15px;">#{order_id}</p>
            
            <p style="margin:0 0 4px 0;color:{self.colors['text_light']};font-size:13px;font-weight:500;">PAYMENT ID</p>
            <p style="margin:0;color:{self.colors['text']};font-size:13px;font-family:'SF Mono',Monaco,'Courier New',monospace;">{payment_id}</p>
        </td>
    </tr>
</table>

{self._button('View order', f'{settings.FRONTEND_URL}/orders/{order_id}')}"""
        
        return self.send_email(to_email, "Payment received", content, user_name)


# Singleton instance
brevo_email_service = BrevoEmailService()
