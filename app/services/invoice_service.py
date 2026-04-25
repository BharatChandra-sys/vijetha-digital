"""
Invoice PDF generation — clean minimal layout.

Uses reportlab to produce a professional A4 Tax Invoice
with logo, clean typography, and GST breakdowns.
"""

from __future__ import annotations

import io
import os
from datetime import datetime
from decimal import Decimal

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from sqlalchemy.orm import Session

from app.models.order import Order

# ── Company constants ─────────────────────────────────────────────
COMPANY_NAME = "Vijetha Digital"
COMPANY_TAGLINE = "Your Digital Printing Partner"
COMPANY_ADDRESS_LINE1 = "Opp. Telugu Academy, Nampally"
COMPANY_ADDRESS_LINE2 = "Hyderabad - 500001, Telangana"
COMPANY_PHONE = "+91-40-23456789"
COMPANY_EMAIL = "info@vijethadigital.com"
COMPANY_WEBSITE = "www.vijethadigital.com"
COMPANY_GSTIN = "36AABCV1234F1ZX"
COMPANY_PAN = "AABCV1234F"
COMPANY_STATE = "36 - Telangana"
COMPANY_HSN = "4911"

_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LOGO_PATH = os.path.join(_PROJECT_ROOT, "frontend", "public", "vd-logo.jpeg")

# ── Colours — intentionally minimal ──────────────────────────────
DARK = colors.HexColor("#222222")
MED = colors.HexColor("#555555")
LIGHT = colors.HexColor("#999999")
BORDER = colors.HexColor("#DDDDDD")
HEADER_BG = colors.HexColor("#F7F7F7")
ACCENT = colors.HexColor("#2D5DA1")  # single subtle blue accent

GST_RATE = Decimal("0.18")
PAGE_W, PAGE_H = A4

# Currency prefix — "Rs." renders in all PDF fonts (the ₹ glyph
# is missing from Helvetica and causes black-square rendering).
RS = "Rs."


def _fmt(amount) -> str:
    """Format a number with 2 decimals and comma grouping."""
    return f"{float(amount or 0):,.2f}"


def _fmt_date(dt) -> str:
    if not dt:
        return "-"
    if isinstance(dt, str):
        dt = datetime.fromisoformat(dt)
    return dt.strftime("%d %b %Y")


def _fmt_datetime(dt) -> str:
    if not dt:
        return "-"
    if isinstance(dt, str):
        dt = datetime.fromisoformat(dt)
    return dt.strftime("%d %b %Y, %I:%M %p")


# ── Public entry-point ────────────────────────────────────────────

def generate_invoice_pdf(db: Session, order: Order) -> bytes:
    """Return bytes of a clean, minimal PDF invoice for *order*."""

    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title=f"Invoice VJ{order.id:08d}",
        author=COMPANY_NAME,
    )

    styles = getSampleStyleSheet()
    usable_w = PAGE_W - 36 * mm

    # ── Reusable paragraph styles ─────────────────────────────────
    def _ps(name, **kw):
        styles.add(ParagraphStyle(name, **kw))

    _ps("Cell", parent=styles["Normal"], fontSize=8.5, leading=12, textColor=DARK)
    _ps("CellBold", parent=styles["Normal"], fontSize=8.5, leading=12,
        textColor=DARK, fontName="Helvetica-Bold")
    _ps("CellRight", parent=styles["Normal"], fontSize=8.5, leading=12,
        textColor=DARK, alignment=TA_RIGHT)
    _ps("CellRightBold", parent=styles["Normal"], fontSize=8.5, leading=12,
        textColor=DARK, alignment=TA_RIGHT, fontName="Helvetica-Bold")
    _ps("Small", parent=styles["Normal"], fontSize=7.5, leading=10, textColor=MED)
    _ps("SmallCenter", parent=styles["Normal"], fontSize=7, leading=9,
        textColor=LIGHT, alignment=TA_CENTER)

    elements: list = []

    # ── Extract order data ────────────────────────────────────────
    inv_number = f"VJ{order.id:08d}"
    inv_date = _fmt_date(order.created_at)
    user = order.user
    customer_name = user.full_name if user else "Customer"
    customer_email = user.email if user else ""
    customer_phone = user.phone or "-"
    customer_address = ""
    if user:
        parts = [p for p in [user.address, user.city, user.state, user.postal_code] if p]
        customer_address = ", ".join(parts) if parts else "Hyderabad, Telangana"

    payment_status = (
        order.payment_status.value
        if hasattr(order.payment_status, "value")
        else str(order.payment_status)
    ).upper()

    # ══════════════════════════════════════════════════════════════
    #  HEADER — Logo + company | Invoice meta
    # ══════════════════════════════════════════════════════════════
    # Left: logo + company block
    if os.path.exists(LOGO_PATH):
        logo = Image(LOGO_PATH, width=28 * mm, height=28 * mm)
        logo.hAlign = "LEFT"
        co_text = Paragraph(
            f"<font size=14><b>{COMPANY_NAME}</b></font><br/>"
            f"<font size=7.5 color='#999999'>{COMPANY_TAGLINE}</font>",
            ParagraphStyle("CoH", parent=styles["Normal"], leading=16, textColor=DARK),
        )
        logo_tbl = Table([[logo, co_text]], colWidths=[32 * mm, usable_w * 0.45])
        logo_tbl.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("LEFTPADDING", (1, 0), (1, 0), 3 * mm),
        ]))
        left_parts = logo_tbl
    else:
        left_parts = Paragraph(
            f"<font size=14><b>{COMPANY_NAME}</b></font><br/>"
            f"<font size=7.5 color='#999999'>{COMPANY_TAGLINE}</font>",
            ParagraphStyle("CoH2", parent=styles["Normal"], leading=16, textColor=DARK),
        )

    # Right: invoice title + number + date
    right_block = Paragraph(
        f"<font size=18 color='#2D5DA1'><b>INVOICE</b></font><br/>"
        f"<font size=9 color='#555555'>No: <b>{inv_number}</b></font><br/>"
        f"<font size=9 color='#555555'>Date: {inv_date}</font>",
        ParagraphStyle("InvH", parent=styles["Normal"], alignment=TA_RIGHT, leading=16),
    )

    header = Table([[left_parts, right_block]], colWidths=[usable_w * 0.6, usable_w * 0.4])
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    elements.append(header)
    elements.append(Spacer(1, 4 * mm))

    # Thin separator
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
    elements.append(Spacer(1, 4 * mm))

    # ── Company details line ──────────────────────────────────────
    elements.append(Paragraph(
        f"<font size=7.5 color='#555555'>"
        f"{COMPANY_ADDRESS_LINE1}, {COMPANY_ADDRESS_LINE2}  |  "
        f"Ph: {COMPANY_PHONE}  |  {COMPANY_EMAIL}</font>",
        styles["Small"],
    ))
    elements.append(Paragraph(
        f"<font size=7.5 color='#555555'>"
        f"GSTIN: {COMPANY_GSTIN}  |  PAN: {COMPANY_PAN}  |  "
        f"State: {COMPANY_STATE}</font>",
        styles["Small"],
    ))
    elements.append(Spacer(1, 5 * mm))

    # ══════════════════════════════════════════════════════════════
    #  BILL TO
    # ══════════════════════════════════════════════════════════════
    elements.append(Paragraph(
        "<font size=8 color='#999999'><b>BILL TO</b></font>",
        styles["Small"],
    ))
    elements.append(Spacer(1, 1 * mm))
    elements.append(Paragraph(f"<b>{customer_name}</b>", styles["CellBold"]))
    if customer_email:
        elements.append(Paragraph(customer_email, styles["Cell"]))
    elements.append(Paragraph(f"Phone: {customer_phone}", styles["Cell"]))
    if customer_address:
        elements.append(Paragraph(customer_address, styles["Cell"]))
    elements.append(Spacer(1, 5 * mm))

    # ══════════════════════════════════════════════════════════════
    #  ITEMS TABLE
    # ══════════════════════════════════════════════════════════════
    col_w = [
        usable_w * 0.05,   # #
        usable_w * 0.40,   # Item
        usable_w * 0.08,   # HSN
        usable_w * 0.08,   # Qty
        usable_w * 0.16,   # Unit Price
        usable_w * 0.23,   # Amount
    ]

    hdr_s = ParagraphStyle("TH", parent=styles["Normal"], fontSize=8, leading=10,
                           textColor=MED, fontName="Helvetica-Bold")
    hdr_r = ParagraphStyle("THR", parent=hdr_s, alignment=TA_RIGHT)

    table_data = [[
        Paragraph("#", hdr_s),
        Paragraph("Item", hdr_s),
        Paragraph("HSN", hdr_s),
        Paragraph("Qty", hdr_r),
        Paragraph("Unit Price", hdr_r),
        Paragraph("Amount", hdr_r),
    ]]

    items = order.items or []
    subtotal = Decimal("0")

    for idx, item in enumerate(items, 1):
        if item.product_id and item.product:
            name = item.product.name
        elif item.material:
            dims = ""
            if item.width_ft and item.height_ft:
                dims = f" ({float(item.width_ft)}x{float(item.height_ft)} ft)"
            name = f"{item.material}{dims}"
        else:
            name = "Custom Item"

        qty = item.quantity
        unit_price = Decimal(str(item.unit_price))
        line_total = Decimal(str(item.total_price))
        subtotal += line_total

        table_data.append([
            Paragraph(str(idx), styles["Cell"]),
            Paragraph(name, styles["CellBold"]),
            Paragraph(COMPANY_HSN, styles["Cell"]),
            Paragraph(str(qty), styles["CellRight"]),
            Paragraph(f"{RS} {_fmt(unit_price)}", styles["CellRight"]),
            Paragraph(f"{RS} {_fmt(line_total)}", styles["CellRightBold"]),
        ])

    items_table = Table(table_data, colWidths=col_w, repeatRows=1)
    items_table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("TOPPADDING", (0, 0), (-1, 0), 7),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 7),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, BORDER),
        # Body rows
        ("TOPPADDING", (0, 1), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
        ("LINEBELOW", (0, 1), (-1, -1), 0.3, BORDER),
        # General
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 4 * mm))

    # ══════════════════════════════════════════════════════════════
    #  TOTALS
    # ══════════════════════════════════════════════════════════════
    total_cgst = (subtotal * Decimal("0.09")).quantize(Decimal("0.01"))
    total_sgst = total_cgst
    total_gst = total_cgst + total_sgst
    grand_total = subtotal + total_gst

    actual_total = Decimal(str(order.total_price)) if order.total_price else grand_total

    lbl = styles["CellRight"]
    val = styles["CellRightBold"]

    t_rows = [
        [Paragraph("Subtotal", lbl), Paragraph(f"{RS} {_fmt(subtotal)}", val)],
        [Paragraph("CGST @ 9%", lbl), Paragraph(f"{RS} {_fmt(total_cgst)}", val)],
        [Paragraph("SGST @ 9%", lbl), Paragraph(f"{RS} {_fmt(total_sgst)}", val)],
    ]

    # Grand total row
    gt_lbl = ParagraphStyle("GTL", parent=styles["Normal"], fontSize=10.5,
                            leading=14, alignment=TA_RIGHT, fontName="Helvetica-Bold",
                            textColor=DARK)
    gt_val = ParagraphStyle("GTV", parent=styles["Normal"], fontSize=10.5,
                            leading=14, alignment=TA_RIGHT, fontName="Helvetica-Bold",
                            textColor=ACCENT)

    t_rows.append([
        Paragraph("Total", gt_lbl),
        Paragraph(f"{RS} {_fmt(actual_total)}", gt_val),
    ])

    tw = [usable_w * 0.30, usable_w * 0.25]
    totals_tbl = Table(t_rows, colWidths=tw, hAlign="RIGHT")
    gt_idx = len(t_rows) - 1
    totals_tbl.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, gt_idx - 1), 0.3, BORDER),
        ("LINEABOVE", (0, gt_idx), (-1, gt_idx), 1, DARK),
        ("TOPPADDING", (0, gt_idx), (-1, gt_idx), 6),
        ("BOTTOMPADDING", (0, gt_idx), (-1, gt_idx), 2),
    ]))
    elements.append(totals_tbl)
    elements.append(Spacer(1, 4 * mm))

    # ── Payment status ────────────────────────────────────────────
    status_color = "#16A34A" if payment_status == "PAID" else "#DC2626"
    elements.append(Paragraph(
        f"<font size=8.5 color='#555555'>Payment Status: </font>"
        f"<font size=8.5 color='{status_color}'><b>{payment_status}</b></font>",
        ParagraphStyle("PayS", parent=styles["Normal"], alignment=TA_RIGHT),
    ))
    elements.append(Spacer(1, 8 * mm))

    # ══════════════════════════════════════════════════════════════
    #  TERMS
    # ══════════════════════════════════════════════════════════════
    elements.append(HRFlowable(width="100%", thickness=0.3, color=BORDER, spaceAfter=3 * mm))
    elements.append(Paragraph(
        "<font size=7 color='#999999'><b>Terms &amp; Conditions</b></font>",
        styles["Small"],
    ))
    elements.append(Spacer(1, 1 * mm))
    terms = [
        "All prices are inclusive of applicable taxes unless stated otherwise.",
        "Goods once sold are not returnable. Reprints for manufacturing defects must be reported within 48 hours of delivery.",
        "Printed colours may vary +/-5% from digital proofs due to substrate and printing process.",
        "Payment is due upon receipt of this invoice. Late payments may attract 1.5% monthly interest.",
        "Delivery timelines are estimates and may vary depending on order volume and material availability.",
        "The company is not liable for delays caused by force majeure events (natural disasters, strikes, etc.).",
        "All disputes are subject to the jurisdiction of courts in Hyderabad, Telangana.",
        "This is a computer-generated invoice and does not require a physical signature.",
    ]
    for t in terms:
        elements.append(Paragraph(
            f"<font size=7 color='#999999'>- {t}</font>", styles["Small"],
        ))

    elements.append(Spacer(1, 4 * mm))

    # ── Contact for issues ────────────────────────────────────────
    elements.append(Paragraph(
        "<font size=7 color='#999999'><b>For Issues &amp; Support</b></font>",
        styles["Small"],
    ))
    elements.append(Spacer(1, 1 * mm))
    elements.append(Paragraph(
        f"<font size=7 color='#999999'>"
        f"If you have any concerns regarding this invoice or your order, please contact us:<br/>"
        f"Phone: {COMPANY_PHONE}  |  Email: {COMPANY_EMAIL}  |  "
        f"Visit: {COMPANY_ADDRESS_LINE1}, {COMPANY_ADDRESS_LINE2}<br/>"
        f"Support hours: Mon-Sat, 9:00 AM - 7:00 PM IST</font>",
        styles["Small"],
    ))

    elements.append(Spacer(1, 5 * mm))

    # ── Footer ────────────────────────────────────────────────────
    elements.append(HRFlowable(width="100%", thickness=0.3, color=BORDER, spaceAfter=2 * mm))
    elements.append(Paragraph(
        f"<b>{COMPANY_NAME}</b>  |  {COMPANY_WEBSITE}  |  {COMPANY_PHONE}",
        styles["SmallCenter"],
    ))

    # ── Build ─────────────────────────────────────────────────────
    doc.build(elements)
    return buf.getvalue()



def generate_and_store_invoice(db: Session, order_id: int) -> dict:
    """
    Generate invoice PDF and store it as an OrderFile.
    
    Args:
        db: Database session
        order_id: Order ID
        
    Returns:
        Dict with file info
    """
    from app.models.order_file import OrderFile, FileType
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise ValueError(f"Order {order_id} not found")
    
    # Check if invoice already exists
    existing = db.query(OrderFile).filter(
        OrderFile.order_id == order_id,
        OrderFile.file_type == FileType.invoice,
    ).first()
    
    if existing:
        return {
            "message": "Invoice already exists",
            "file_id": existing.id,
            "file_path": existing.file_path,
        }
    
    # Generate PDF
    pdf_bytes = generate_invoice_pdf(db, order)
    
    # Save to file system
    import os
    from app.core.config import settings
    
    upload_dir = settings.UPLOAD_DIR
    invoices_dir = os.path.join(upload_dir, "invoices")
    os.makedirs(invoices_dir, exist_ok=True)
    
    filename = f"invoice_{order.id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    file_path = os.path.join(invoices_dir, filename)
    
    with open(file_path, "wb") as f:
        f.write(pdf_bytes)
    
    # Create OrderFile record
    order_file = OrderFile(
        order_id=order.id,
        file_type=FileType.invoice,
        file_path=file_path,
        file_name=filename,
        file_size=len(pdf_bytes),
        uploaded_by=None,  # System generated
    )
    
    db.add(order_file)
    db.commit()
    db.refresh(order_file)
    
    return {
        "message": "Invoice generated and stored",
        "file_id": order_file.id,
        "file_path": file_path,
        "file_name": filename,
        "file_size": len(pdf_bytes),
    }


def get_invoice_for_order(db: Session, order_id: int) -> OrderFile:
    """
    Get invoice file for an order.
    
    Args:
        db: Database session
        order_id: Order ID
        
    Returns:
        OrderFile or None
    """
    from app.models.order_file import OrderFile, FileType
    
    return db.query(OrderFile).filter(
        OrderFile.order_id == order_id,
        OrderFile.file_type == FileType.invoice,
    ).first()
