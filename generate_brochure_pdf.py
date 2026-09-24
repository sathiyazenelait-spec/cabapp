import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and display total page count:
    'Page X of Y' on headers and footers.
    """
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        # Skip header and footer on cover page (page 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        
        # Header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0284C7"))
        self.drawString(54, 11 * inch - 36, "SafePassage AI")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(122, 11 * inch - 36, "|  Complete Workflow & Role-Based Move Documentation")
        
        self.setFont("Helvetica", 8)
        self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "Enterprise Release v2.4")
        
        # Header Rule
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Footer Rule
        self.line(54, 46, 8.5 * inch - 54, 46)

        # Footer Content
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 34, "Confidential — SafePassage AI Integrated Fleet & Safety Network")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0F172A"))
        self.drawRightString(8.5 * inch - 54, 34, page_str)

        self.restoreState()


def build_pdf_brochure(filename="SafePassage_AI_Master_Workflow_Brochure_Documentation.pdf"):
    # Target page setup: 8.5 x 11 inches, 0.75 in margins
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_NAVY = colors.HexColor("#0F172A")
    C_BLUE = colors.HexColor("#0284C7")
    C_TEAL = colors.HexColor("#0D9488")
    C_DARK = colors.HexColor("#1E293B")
    C_TEXT = colors.HexColor("#334155")
    C_LIGHT_BG = colors.HexColor("#F8FAFC")
    C_CARD_BG = colors.HexColor("#F1F5F9")
    C_ICE = colors.HexColor("#F0F9FF")
    C_AMBER = colors.HexColor("#D97706")
    C_GREEN = colors.HexColor("#059669")
    C_BORDER = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=C_NAVY,
        alignment=TA_CENTER
    )

    cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=C_BLUE,
        alignment=TA_CENTER
    )

    cover_desc = ParagraphStyle(
        'CoverDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=C_TEXT,
        alignment=TA_CENTER
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=22,
        textColor=C_NAVY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=C_BLUE,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Header3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=C_DARK,
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=13.5,
        textColor=C_TEXT,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'CustomBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=C_NAVY
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=13,
        textColor=C_DARK
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11,
        textColor=C_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11,
        textColor=C_NAVY
    )

    table_hdr = ParagraphStyle(
        'TableHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.white
    )

    story = []

    def make_callout(text, title="KEY WORKFLOW DIRECTIVE", bg=C_ICE, border=C_BLUE, text_color=C_DARK):
        p_title = Paragraph(f"<b>{title}</b>", ParagraphStyle('CTitle', parent=callout_style, fontName='Helvetica-Bold', textColor=border, fontSize=9))
        p_body = Paragraph(text, ParagraphStyle('CBody', parent=callout_style, textColor=text_color))
        t = Table([[p_title], [p_body]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg),
            ('BOX', (0,0), (-1,-1), 1, border),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        return t

    def make_badge_table(items, col_widths=[126, 126, 126, 126]):
        data = [[Paragraph(f"<b>{k}</b><br/><font color='#64748B' size='7.5'>{v}</font>", table_cell) for k, v in items]]
        t = Table(data, colWidths=col_widths)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
            ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    
    # Brand Top Badge
    badge_data = [[Paragraph("<b>SAFEPASSAGE AI — ENTERPRISE SMART TRANSPORTATION NETWORK</b>", ParagraphStyle('Brd', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#0284C7"), alignment=TA_CENTER))]]
    badge_tbl = Table(badge_data, colWidths=[504])
    badge_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#E0F2FE")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#38BDF8")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(badge_tbl)
    story.append(Spacer(1, 30))

    story.append(Paragraph("SafePassage AI", title_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("School & College Cab Management System", cover_subtitle))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="80%", thickness=2, color=C_BLUE, spaceBefore=4, spaceAfter=14))
    
    story.append(Paragraph(
        "<b>Complete System Architecture, Role-Based Operational Move Manual & Technical Master Brochure</b><br/>"
        "A Unified Multi-Tenant Platform for Institutions, Fleets, Drivers, Students, Parents & Corporate Shuttles",
        cover_desc
    ))
    story.append(Spacer(1, 36))

    # Highlights Grid
    cover_grid_data = [
        [
            Paragraph("<b>🛡️ Strict Multi-Role Gateway</b><br/><font size='7.5' color='#64748B'>Direct Super Admin approval (⚡ 30-min SLA or 📅 Tomorrow batch).</font>", table_cell),
            Paragraph("<b>⚡ 45-Second AI Dispatch</b><br/><font size='7.5' color='#64748B'>Dynamic radar radius clustering and rapid trip matching algorithm.</font>", table_cell)
        ],
        [
            Paragraph("<b>📍 Live Radar Telemetry</b><br/><font size='7.5' color='#64748B'>Real-time student & vehicle tracking with geofence proximity alerts.</font>", table_cell),
            Paragraph("<b>💳 Automated Clearinghouse</b><br/><font size='7.5' color='#64748B'>Razorpay fee escrow, automated payouts, and subscription ledgers.</font>", table_cell)
        ],
        [
            Paragraph("<b>📱 3 Native Mobile APKs</b><br/><font size='7.5' color='#64748B'>React Native Parent App, Driver Cockpit & Admin Mobile Consoles.</font>", table_cell),
            Paragraph("<b>⚙️ 6 Microservice Engines</b><br/><font size='7.5' color='#64748B'>Spring Boot 3.2 distributed mesh on MySQL transactional database.</font>", table_cell)
        ]
    ]
    cover_tbl = Table(cover_grid_data, colWidths=[246, 246])
    cover_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(cover_tbl)
    story.append(Spacer(1, 40))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Document Version:</b> 2.4.0 Release", table_cell), Paragraph("<b>Release Date:</b> September 2026", table_cell)],
        [Paragraph("<b>Author / System:</b> DeepMind AI Architecture Suite", table_cell), Paragraph("<b>Security Classification:</b> Enterprise Tier-1", table_cell)],
        [Paragraph("<b>Target Audience:</b> Admins, Fleets, Drivers, Institutions", table_cell), Paragraph("<b>Total Modules:</b> 12 Sections Across 6 User Roles", table_cell)]
    ]
    meta_tbl = Table(meta_data, colWidths=[252, 252])
    meta_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_tbl)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: TABLE OF CONTENTS & EXECUTIVE SUMMARY
    # =========================================================================
    story.append(Paragraph("Table of Contents", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    toc_data = [
        [Paragraph("<b>Section 1: Executive Overview & Unified Ecosystem Architecture</b>", table_cell), Paragraph("Page 3", table_cell_bold)],
        [Paragraph("<b>Section 2: Authentication Gateway & Direct Super Admin Approval (30-Min/Tomorrow SLA)</b>", table_cell), Paragraph("Page 5", table_cell_bold)],
        [Paragraph("<b>Section 3: Role 1 — Super Admin Master Console & Central Governance</b>", table_cell), Paragraph("Page 7", table_cell_bold)],
        [Paragraph("<b>Section 4: Role 2 — Cab Driver Mobile Cockpit & 45-Second Dispatch Protocol</b>", table_cell), Paragraph("Page 10", table_cell_bold)],
        [Paragraph("<b>Section 5: Role 3 — Cab Owner & Fleet Agency Management Portal</b>", table_cell), Paragraph("Page 13", table_cell_bold)],
        [Paragraph("<b>Section 6: Role 4 — Parent Mobile App, Radar Tracking & Child Safety Network</b>", table_cell), Paragraph("Page 15", table_cell_bold)],
        [Paragraph("<b>Section 7: Role 5 — College Student Smart Commute & Peer Ride-Sharing Pass</b>", table_cell), Paragraph("Page 18", table_cell_bold)],
        [Paragraph("<b>Section 8: Role 6 — Corporate Working Professional Shuttle & Desk-to-Door Roster</b>", table_cell), Paragraph("Page 20", table_cell_bold)],
        [Paragraph("<b>Section 9: Native Mobile Applications & Android Studio / Emulator Ecosystem</b>", table_cell), Paragraph("Page 22", table_cell_bold)],
        [Paragraph("<b>Section 10: Backend Microservices & API Gateway Mesh Architecture</b>", table_cell), Paragraph("Page 24", table_cell_bold)],
        [Paragraph("<b>Section 11: Database Architecture & MySQL Relational Schema</b>", table_cell), Paragraph("Page 26", table_cell_bold)],
        [Paragraph("<b>Section 12: Operational Runbook, 1-Click Launchers & Verification Matrix</b>", table_cell), Paragraph("Page 28", table_cell_bold)]
    ]
    toc_tbl = Table(toc_data, colWidths=[420, 84])
    toc_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(toc_tbl)
    story.append(Spacer(1, 14))

    story.append(Paragraph("Executive Summary", h2_style))
    story.append(Paragraph(
        "<b>SafePassage AI</b> is an enterprise-grade, holistic transportation intelligence platform designed to eliminate the logistical chaos, security risks, and administrative overhead associated with educational institution cabs, commercial fleet networks, college student transit, and corporate employee shuttles. By combining high-frequency GPS telemetry, automated 45-second dispatch heuristics, dynamic stop clustering, and a rigorous multi-role authorization framework, SafePassage AI provides real-time transparency and safety to all stakeholders.",
        body_style
    ))
    story.append(Paragraph(
        "The system operates across six distinct user personas with customized user interfaces (both responsive web prototypes and native React Native mobile applications), powered by a decoupled Spring Boot microservices backend and an enterprise MySQL relational persistence tier.",
        body_style
    ))
    
    story.append(Spacer(1, 8))
    story.append(make_callout(
        "<b>System Milestone Summary:</b> All 6 microservices (8080–8085), the web prototype (5173), and the 3 Android React Native mobile apps (Parent 8092, Driver 8091, Admin 8093) have been fully built, verified, and linked to automated 1-click desktop launchers with robust Intel UHD hardware acceleration.",
        title="CURRENT DEPLOYMENT STATUS: ACTIVE & VERIFIED"
    ))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3 & 4: SECTION 1 - ECOSYSTEM & ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("Section 1: Executive Overview & Unified Ecosystem Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("1.1 The Core Problem & Value Proposition", h2_style))
    story.append(Paragraph(
        "Conventional institutional transport relies on manual paper rosters, unverified drivers, unreliable phone calls from anxious parents, and unmonitored routes. SafePassage AI solves these pain points through four foundational pillars:",
        body_style
    ))

    story.append(Paragraph("• <b>Zero-Trust Safety & Verification:</b> Strict Super Admin approval protocol for every registered driver, vehicle, and student pass before authorization.", bullet_style))
    story.append(Paragraph("• <b>Live Telemetry & Radar Proximity:</b> High-precision GPS streaming with automated 500m and 100m geofence alerts pushed to parents and riders.", bullet_style))
    story.append(Paragraph("• <b>45-Second AI Dispatch Protocol:</b> Algorithmic matching for ad-hoc and single-trip transport requests with boarding PIN security.", bullet_style))
    story.append(Paragraph("• <b>Unified Clearinghouse:</b> Automated Razorpay subscription collections, driver payouts, and institutional billing reconciliation.", bullet_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph("1.2 Ecosystem Personas & Matrix", h2_style))

    personas_data = [
        [Paragraph("Role Persona", table_hdr), Paragraph("Primary Interface", table_hdr), Paragraph("Core Responsibilities", table_hdr), Paragraph("SLA / Security Policy", table_hdr)],
        [Paragraph("<b>Super Admin</b>", table_cell_bold), Paragraph("Web Console (5173)<br/>Admin Mobile APK", table_cell), Paragraph("Master governance, multi-institution onboarding, direct registration approvals, financial settlements, emergency broadcast.", table_cell), Paragraph("Master Password protected; Instant or Scheduled activation authority.", table_cell)],
        [Paragraph("<b>Cab Driver</b>", table_cell_bold), Paragraph("Driver Mobile APK (8091)<br/>Web Cockpit", table_cell), Paragraph("Shift toggle, turn-by-turn waypoint navigation, student boarding roster, 45s trip acceptance, SOS beacon.", table_cell), Paragraph("License validation; Strict approval required; 4-digit passenger OTP boarding.", table_cell)],
        [Paragraph("<b>Cab Owner</b>", table_cell_bold), Paragraph("Fleet Web Portal (5173)", table_cell), Paragraph("Multi-vehicle management, driver shift assignment, fuel/maintenance logs, contract bidding, revenue analytics.", table_cell), Paragraph("Commercial vehicle permit, RC book, and fitness certificate verification.", table_cell)],
        [Paragraph("<b>Parent</b>", table_cell_bold), Paragraph("Parent Mobile APK (8092)<br/>Web Portal", table_cell), Paragraph("Live bus radar tracking, student pickup/drop alerts, digital fee payment, driver emergency call, absence marking.", table_cell), Paragraph("Student linked account; Proximity push alerts at 500m & 100m.", table_cell)],
        [Paragraph("<b>Student</b>", table_cell_bold), Paragraph("Student Web Hub (5173)<br/>Pass APK", table_cell), Paragraph("Digital campus pass, daily shuttle live locator, peer ride-share booking, split-fare calculation, SOS emergency link.", table_cell), Paragraph("Institution roll number & semester identity validation.", table_cell)],
        [Paragraph("<b>Working Pro</b>", table_cell_bold), Paragraph("Corporate Web Shuttle (5173)", table_cell), Paragraph("IT Park / Corporate daily shuttle subscription, desk-to-door dynamic routing, expense voucher reimbursement.", table_cell), Paragraph("Corporate employee ID & office shift validation.", table_cell)]
    ]

    p_tbl = Table(personas_data, colWidths=[80, 110, 190, 124])
    p_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(p_tbl)

    story.append(Spacer(1, 12))
    story.append(Paragraph("1.3 High-Level Solution Topology", h2_style))
    story.append(Paragraph(
        "The SafePassage AI ecosystem consists of 3 synchronized tiers: the Client Tier (Vite Web Prototype & React Native Mobile Apps), the Microservices Gateway Mesh (6 Spring Boot services), and the Storage & Clearinghouse Tier (MySQL Relational Database & Razorpay Webhooks). All components communicate via low-latency REST APIs and WebSocket telemetry endpoints.",
        body_style
    ))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 5 & 6: SECTION 2 - AUTHENTICATION & DIRECT SUPER ADMIN APPROVAL
    # =========================================================================
    story.append(Paragraph("Section 2: Authentication Gateway & Direct Super Admin Approval", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("2.1 Direct Super Admin Approval vs. Forced OTP Workflow", h2_style))
    story.append(Paragraph(
        "To provide a frictionless yet highly secure onboarding experience, SafePassage AI has transitioned to a <b>Direct Super Admin Acceptance</b> model. Users are <b>not</b> burdened with entering complex 6-digit OTP codes for new registrations. Instead, when a new driver, owner, parent, student, or professional submits their registration, their application is dispatched directly into the Super Admin's Central Authorization Desk.",
        body_style
    ))

    story.append(make_callout(
        "<b>Two Flexible Approval SLAs for Registrations:</b><br/>"
        "1. <b>⚡ Accept Now (within 30 Minutes):</b> Fast-track emergency review for immediate driver shifts or urgent student cab enrollments.<br/>"
        "2. <b>📅 Accept for Tomorrow:</b> Standard batch processing for upcoming semester admissions or scheduled fleet expansions.",
        title="DIRECT REGISTRATION APPROVAL PROTOCOL",
        bg=colors.HexColor("#FEF3C7"),
        border=C_AMBER
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.2 Master Credentials Reference Table", h2_style))
    story.append(Paragraph(
        "For immediate system demonstration, testing, and operational validation, the following verified credentials are configured across all roles:",
        body_style
    ))

    creds_data = [
        [Paragraph("Role / Persona", table_hdr), Paragraph("Username", table_hdr), Paragraph("Password", table_hdr), Paragraph("Registered Identifier", table_hdr), Paragraph("Direct Contact", table_hdr)],
        [Paragraph("<b>Super Admin</b>", table_cell_bold), Paragraph("admin", table_cell), Paragraph("admin123", table_cell_bold), Paragraph("admin@safepassage.ai", table_cell), Paragraph("+91 90000 00001", table_cell)],
        [Paragraph("<b>Cab Driver</b>", table_cell_bold), Paragraph("kumar_driver", table_cell), Paragraph("driver123", table_cell_bold), Paragraph("kumar@cabs.com", table_cell), Paragraph("+91 98401 23456", table_cell)],
        [Paragraph("<b>Cab Owner</b>", table_cell_bold), Paragraph("ravi_owner", table_cell), Paragraph("owner123", table_cell_bold), Paragraph("ravi.owner@chennaicabs.com", table_cell), Paragraph("+91 98401 55667", table_cell)],
        [Paragraph("<b>Parent</b>", table_cell_bold), Paragraph("priya_parent", table_cell), Paragraph("parent123", table_cell_bold), Paragraph("priya.sharma@gmail.com", table_cell), Paragraph("+91 98401 11223", table_cell)],
        [Paragraph("<b>Student</b>", table_cell_bold), Paragraph("mahesh_student", table_cell), Paragraph("student123", table_cell_bold), Paragraph("mahesh.k@loyola.edu", table_cell), Paragraph("+91 98401 99887", table_cell)],
        [Paragraph("<b>Working Pro</b>", table_cell_bold), Paragraph("vikram_pro", table_cell), Paragraph("pro123", table_cell_bold), Paragraph("vikram.m@tcs.com", table_cell), Paragraph("+91 98401 44332", table_cell)]
    ]
    creds_tbl = Table(creds_data, colWidths=[90, 85, 75, 140, 114])
    creds_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(creds_tbl)

    story.append(Spacer(1, 12))
    story.append(Paragraph("2.3 Real-Time Approval Status Tracker", h2_style))
    story.append(Paragraph(
        "Applicants can click <b>'Check Approval Status'</b> at any time on the login gateway. Entering their email or phone number displays the real-time review state (Awaiting Super Admin Decision ⏳, Active Now ✅, or Accepted for Tomorrow 📅). Once the Super Admin clicks 'Accept & Activate Now', the account becomes instantly accessible without requiring any secondary code verification.",
        body_style
    ))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 7, 8, 9: SECTION 3 - SUPER ADMIN CONSOLE
    # =========================================================================
    story.append(Paragraph("Section 3: Role 1 — Super Admin Master Console & Central Governance", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("3.1 Role Purpose & Governance Scope", h2_style))
    story.append(Paragraph(
        "The <b>Super Admin Master Console</b> serves as the central control tower for the entire SafePassage AI network. It provides top-tier oversight across multiple schools, colleges, fleet owners, driver rosters, vehicle compliance databases, financial escrows, and live emergency incidents.",
        body_style
    ))

    story.append(Paragraph("3.2 Core Functional Modules", h2_style))
    story.append(Paragraph("1. <b>Live Fleet Radar & Telemetry Heatmap:</b> Real-time geographic visualization of all active school buses, college shuttles, and commercial cabs with speed, heading, and delay status.", bullet_style))
    story.append(Paragraph("2. <b>Direct Registration Approval & SLA Queue:</b> Immediate 1-click authorization controls (`⚡ Accept & Activate Now`, `📅 Accept for Tomorrow`, `❌ Reject`) with live audit streaming.", bullet_style))
    story.append(Paragraph("3. <b>Multi-Tenant Institution Management:</b> Create, configure, and manage schools and colleges with custom route networks, stop coordinates, and fee structures.", bullet_style))
    story.append(Paragraph("4. <b>Financial Clearinghouse & Razorpay Settlements:</b> Monthly subscription fee audits, platform commission deduction (10–15%), automated driver payouts, and escrow releases.", bullet_style))
    story.append(Paragraph("5. <b>Emergency Broadcast & Incident Management:</b> Immediate one-touch broadcast to all drivers and parents in case of weather emergencies, route blockades, or panic SOS triggers.", bullet_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph("3.3 Step-by-Step Super Admin Move Workflow", h2_style))

    admin_steps = [
        [Paragraph("Step #", table_hdr), Paragraph("Operational Action", table_hdr), Paragraph("System Response & State Transition", table_hdr), Paragraph("Audit & Output", table_hdr)],
        [Paragraph("<b>Step 1</b>", table_cell_bold), Paragraph("Log In as Super Admin", table_cell), Paragraph("Master password verification (`admin123`). Session initialized with master governance tokens.", table_cell), Paragraph("Audit log: `Admin session active`", table_cell)],
        [Paragraph("<b>Step 2</b>", table_cell_bold), Paragraph("Open Approvals Desk", table_cell), Paragraph("Reviews pending registrations. Cards display requested SLA (`⚡ Within 30 min` vs `📅 Tomorrow`).", table_cell), Paragraph("Queue displays pending applicant count.", table_cell)],
        [Paragraph("<b>Step 3</b>", table_cell_bold), Paragraph("Accept Registration", table_cell), Paragraph("Clicks `⚡ Accept & Activate Now`. Account state immediately changes to `ACTIVATED`.", table_cell), Paragraph("Audit log: `APPROVED: User activated`", table_cell)],
        [Paragraph("<b>Step 4</b>", table_cell_bold), Paragraph("Monitor Live Fleet Radar", table_cell), Paragraph("Interactive Leaflet map displays real-time GPS locations, route lines, and stop markers.", table_cell), Paragraph("Active vehicles telemetry refreshed at 3s intervals.", table_cell)],
        [Paragraph("<b>Step 5</b>", table_cell_bold), Paragraph("Run Financial Settlement", table_cell), Paragraph("Audits monthly collections, deducts platform fee, dispatches payouts to fleet owners.", table_cell), Paragraph("Razorpay payout batch receipt generated.", table_cell)]
    ]
    a_tbl = Table(admin_steps, colWidths=[46, 120, 200, 138])
    a_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(a_tbl)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 10, 11, 12: SECTION 4 - CAB DRIVER COCKPIT
    # =========================================================================
    story.append(Paragraph("Section 4: Role 2 — Cab Driver Mobile Cockpit & 45-Second Dispatch", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("4.1 Role Overview & Mobile Experience", h2_style))
    story.append(Paragraph(
        "The <b>Cab Driver Mobile Cockpit</b> (running natively on Android port `8091` or responsive web) empowers school bus drivers, van captains, and on-demand cab operators with distraction-free turn-by-turn navigation, a digital student boarding roster, 45-second fast-dispatch alerts, and instant SOS beacons.",
        body_style
    ))

    story.append(Paragraph("4.2 The 45-Second Fast Dispatch Protocol", h2_style))
    story.append(Paragraph(
        "When an ad-hoc or single-trip booking is requested, the SafePassage routing engine broadcasts the trip to drivers within a 3.5 km radius. The driver has a <b>45-second countdown timer</b> to accept. Upon arrival at the pickup waypoint, passenger boarding is authenticated via a dynamic 4-digit PIN.",
        body_style
    ))

    story.append(make_callout(
        "<b>4-Stage Single Trip Lifecycle:</b><br/>"
        "1. <b>DISPATCH (45s Timer):</b> Driver receives audible chime and route preview.<br/>"
        "2. <b>ACCEPTED & EN ROUTE:</b> GPS telemetry shared with passenger and parent.<br/>"
        "3. <b>ARRIVED & OTP VERIFY:</b> Driver enters passenger's 4-digit PIN to unlock vehicle doors.<br/>"
        "4. <b>TRIP COMMENCED & COMPLETED:</b> Automated fare settlement and receipt dispatch.",
        title="45-SECOND SINGLE TRIP PROTOCOL",
        bg=colors.HexColor("#ECFDF5"),
        border=C_GREEN
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("4.3 Digital Conductor Roster & Waypoint Navigation", h2_style))
    story.append(Paragraph(
        "For scheduled school morning and afternoon routes, the driver cockpit renders an integrated waypoint checklist. As the vehicle approaches each student's home stop (detected via GPS geofencing), the driver marks the student as <b>Boarded</b>, <b>Absent</b>, or <b>Dropped Off</b>. Parents receive automated SMS and in-app push alerts instantly.",
        body_style
    ))

    driver_steps = [
        [Paragraph("Phase", table_hdr), Paragraph("Driver Interaction", table_hdr), Paragraph("Automated System Action", table_hdr)],
        [Paragraph("<b>Shift Start</b>", table_cell_bold), Paragraph("Toggle 'On Duty' in Driver APK.", table_cell), Paragraph("Vehicle telemetry begins broadcasting to Super Admin & Parent apps.", table_cell)],
        [Paragraph("<b>Route Start</b>", table_cell_bold), Paragraph("Click 'Begin Morning School Route'.", table_cell), Paragraph("Route polyline loaded; Next stop ETA calculated and pushed to parents.", table_cell)],
        [Paragraph("<b>Stop Arrival</b>", table_cell_bold), Paragraph("Vehicle enters 100m geofence radius.", table_cell), Paragraph("Proximity push alert sent to parent: 'Bus arriving in 2 mins'.", table_cell)],
        [Paragraph("<b>Boarding</b>", table_cell_bold), Paragraph("Tap student checkbox on digital roster.", table_cell), Paragraph("Child marked boarded; Timestamp recorded in MySQL database.", table_cell)],
        [Paragraph("<b>School Arrival</b>", table_cell_bold), Paragraph("Tap 'Complete Morning Trip'.", table_cell), Paragraph("All students marked safely arrived at school; Trip summary logged.", table_cell)]
    ]
    d_tbl = Table(driver_steps, colWidths=[80, 180, 244])
    d_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(d_tbl)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 13 & 14: SECTION 5 - CAB OWNER & FLEET PORTAL
    # =========================================================================
    story.append(Paragraph("Section 5: Role 3 — Cab Owner & Fleet Agency Management Portal", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("5.1 Fleet Operations & Contract Marketplace", h2_style))
    story.append(Paragraph(
        "Commercial cab owners, school van operators, and corporate fleet contractors utilize the <b>Cab Owner Portal</b> to manage multiple vehicles, assign drivers to scheduled routes, monitor fuel efficiency and maintenance schedules, bid on institutional transport contracts, and track net payout revenues.",
        body_style
    ))

    story.append(Paragraph("5.2 Key Fleet Features", h2_style))
    story.append(Paragraph("• <b>Vehicle Compliance Vault:</b> Automated expiry alerts for Fitness Certificates (FC), Commercial Insurance, State Permits, and Pollution Under Control (PUC) certificates.", bullet_style))
    story.append(Paragraph("• <b>Driver-to-Cab Allocation Matrix:</b> Dynamic drag-and-drop driver assignment for morning school shifts, afternoon return trips, and evening corporate runs.", bullet_style))
    story.append(Paragraph("• <b>Contract Bidding Engine:</b> Bid on exclusive transportation contracts published by partner schools, colleges, and IT tech parks.", bullet_style))
    story.append(Paragraph("• <b>Fuel & Maintenance Ledger:</b> Log fuel fills, odometer milestones, tire rotations, and engine servicing with cost-per-kilometer profitability charts.", bullet_style))

    story.append(Spacer(1, 10))
    story.append(make_badge_table([
        ("Fleet Capacity", "1 to 50+ Commercial Cabs"),
        ("Compliance Check", "Automated RTO Verification"),
        ("Payout Cycle", "Weekly / Monthly Automated"),
        ("Commission Model", "10% Platform Fee")
    ]))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 15, 16, 17: SECTION 6 - PARENT MOBILE APP
    # =========================================================================
    story.append(Paragraph("Section 6: Role 4 — Parent Mobile App & Student Safety Portal", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("6.1 Complete Peace of Mind for Parents", h2_style))
    story.append(Paragraph(
        "The <b>Parent Mobile App</b> (running on port `8092` with dedicated Metro packaging) is engineered to provide absolute transparency into student transit. Parents can track their child's school cab in real time on an interactive radar map, receive proactive proximity alerts, verify driver credentials, mark student absences, and pay monthly transportation fees securely.",
        body_style
    ))

    story.append(Paragraph("6.2 Step-by-Step Parent Daily Move Workflow", h2_style))

    parent_steps = [
        [Paragraph("Daily Event", table_hdr), Paragraph("Parent Action in App", table_hdr), Paragraph("Live System Feedback", table_hdr)],
        [Paragraph("<b>Morning Pickup</b>", table_cell_bold), Paragraph("Open app to check Live Radar.", table_cell), Paragraph("Vehicle location, speed (e.g. 34 km/h), and dynamic ETA displayed.", table_cell)],
        [Paragraph("<b>500m Proximity</b>", table_cell_bold), Paragraph("Receives push notification.", table_cell), Paragraph("Alert: 'Cab is 500m away. Please prepare child at pickup point.'", table_cell)],
        [Paragraph("<b>Boarding Confirm</b>", table_cell_bold), Paragraph("App screen updates automatically.", table_cell), Paragraph("Status changes to: 'Child Safely Boarded at 7:42 AM'.", table_cell)],
        [Paragraph("<b>School Drop-off</b>", table_cell_bold), Paragraph("Receives arrival confirmation.", table_cell), Paragraph("Notification: 'Child safely arrived at ABC School campus.'", table_cell)],
        [Paragraph("<b>Leave Marking</b>", table_cell_bold), Paragraph("Tap 'Mark Absent' if child is sick.", table_cell), Paragraph("Stop automatically bypassed on driver's morning route; Saves 6 mins.", table_cell)],
        [Paragraph("<b>Fee Payment</b>", table_cell_bold), Paragraph("Click 'Pay Monthly Fee (Rs. 2,400)'.", table_cell), Paragraph("Razorpay payment gateway opens; Digital receipt generated instantly.", table_cell)]
    ]
    par_tbl = Table(parent_steps, colWidths=[90, 190, 224])
    par_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(par_tbl)

    story.append(Spacer(1, 10))
    story.append(make_callout(
        "<b>Direct Driver Emergency Calling:</b> The Parent App features a 1-tap direct call button connecting the parent straight to the assigned cab driver's verified mobile phone without revealing personal private numbers via telephony masking.",
        title="SAFETY & EMERGENCY PROTOCOL",
        bg=colors.HexColor("#FEF2F2"),
        border=colors.HexColor("#EF4444"),
        text_color=colors.HexColor("#991B1B")
    ))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 18 & 19: SECTION 7 - STUDENT COMMUTE & RIDE-SHARING
    # =========================================================================
    story.append(Paragraph("Section 7: Role 5 — College Student Commuter Pass & Ride Share", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("7.1 College Transit & Peer Pooling Network", h2_style))
    story.append(Paragraph(
        "College and university students need flexible transit options tailored to shifting academic schedules, club activities, and campus peer pooling. The <b>Student Commuter Hub</b> provides digital QR passes, live shuttle tracking, and peer ride-sharing with automated split-fare calculations.",
        body_style
    ))

    story.append(Paragraph("7.2 Digital Smart Commute Pass", h2_style))
    story.append(Paragraph("• <b>Dynamic QR Pass:</b> Cryptographically refreshed QR pass scanned by the college bus conductor to record boarding.", bullet_style))
    story.append(Paragraph("• <b>Live Campus Shuttle Radar:</b> View all campus-bound buses, current passenger occupancy percentages, and estimated arrival times at designated city stops.", bullet_style))
    story.append(Paragraph("• <b>Peer Ride Pooling:</b> Request shared rides with fellow verified students heading in the same direction, splitting fuel costs automatically.", bullet_style))
    story.append(Paragraph("• <b>Night Exam Shuttle Booking:</b> Special late-evening bus bookings during semester examinations with campus security escort link.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 20 & 21: SECTION 8 - WORKING PROFESSIONAL SHUTTLE
    # =========================================================================
    story.append(Paragraph("Section 8: Role 6 — Corporate Working Professional Shuttle Service", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("8.1 Corporate IT Park & Enterprise Mobility", h2_style))
    story.append(Paragraph(
        "Working professionals and corporate employees commuting to IT Parks, Special Economic Zones (SEZs), and corporate campuses utilize the <b>Corporate Shuttle Service</b>. The platform coordinates desk-to-door dynamic routing, automated expense reimbursement invoices, and late-night shift safety protocols.",
        body_style
    ))

    story.append(Paragraph("8.2 Key Corporate Capabilities", h2_style))
    story.append(Paragraph("• <b>Guaranteed Reserved Seating:</b> Subscribe to monthly morning and evening fixed-time corporate luxury shuttles.", bullet_style))
    story.append(Paragraph("• <b>Desk-to-Door Route Optimization:</b> AI clustering calculates the most efficient pickup sequence based on daily employee attendance.", bullet_style))
    story.append(Paragraph("• <b>GST-Compliant Corporate Invoicing:</b> Download tax invoices for monthly corporate travel reimbursement.", bullet_style))
    story.append(Paragraph("• <b>Late-Night Safety Escort:</b> Automated drop-off confirmation ping required when employee arrives home after 8:00 PM.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 22 & 23: SECTION 9 - NATIVE MOBILE APPS ECOSYSTEM
    # =========================================================================
    story.append(Paragraph("Section 9: Native Mobile Applications Ecosystem", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("9.1 React Native Multi-App Structure", h2_style))
    story.append(Paragraph(
        "SafePassage AI features three dedicated React Native mobile applications sharing a unified TypeScript design system with optimized build configurations:",
        body_style
    ))

    apps_data = [
        [Paragraph("Application Name", table_hdr), Paragraph("Directory & Package", table_hdr), Paragraph("Metro Port", table_hdr), Paragraph("Target Device / Emulator", table_hdr)],
        [Paragraph("<b>SafePassage Parent App</b>", table_cell_bold), Paragraph("`frontend-mobile-parent`<br/>com.helloworld", table_cell), Paragraph("8092", table_cell_bold), Paragraph("Android Phone / Pixel 3a AVD", table_cell)],
        [Paragraph("<b>SafePassage Driver Cockpit</b>", table_cell_bold), Paragraph("`frontend-mobile-driver`<br/>com.helloworld", table_cell), Paragraph("8091", table_cell_bold), Paragraph("Android Phone / Pixel 3a AVD", table_cell)],
        [Paragraph("<b>SafePassage Admin Mobile</b>", table_cell_bold), Paragraph("`frontend-mobile-admin`<br/>com.helloworld", table_cell), Paragraph("8093", table_cell_bold), Paragraph("Android Phone / Pixel 3a AVD", table_cell)]
    ]
    app_tbl = Table(apps_data, colWidths=[120, 150, 74, 160])
    app_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(app_tbl)

    story.append(Spacer(1, 10))
    story.append(Paragraph("9.2 Automated Port Reversal & Hardware Acceleration", h2_style))
    story.append(Paragraph(
        "To guarantee smooth local development and zero-crash execution on Windows machines with Intel UHD Graphics, the automated launcher scripts execute the following pipeline:",
        body_style
    ))

    story.append(Paragraph("1. <b>Emulator Boot:</b> Launches AVD with `-no-snapshot -gpu swiftshader_indirect` to prevent Intel graphics translator crashes.", bullet_style))
    story.append(Paragraph("2. <b>ADB Wait & Boot Detection:</b> Polls `sys.boot_completed` property with 180s cold-boot resilience.", bullet_style))
    story.append(Paragraph("3. <b>Network Port Reversal:</b> Maps `adb reverse tcp:8092 tcp:8092` (Metro) and `adb reverse tcp:8085 tcp:8085` (Parent API).", bullet_style))
    story.append(Paragraph("4. <b>Dedicated Metro Window:</b> Starts independent Metro bundler process on assigned port.", bullet_style))
    story.append(Paragraph("5. <b>Gradle Build & APK Deploy:</b> Automatically compiles debug APK and launches `.MainActivity` on screen.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 24 & 25: SECTION 10 - BACKEND MICROSERVICES MESH
    # =========================================================================
    story.append(Paragraph("Section 10: Backend Microservices & API Gateway Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("10.1 Spring Boot Microservices Decomposition", h2_style))
    story.append(Paragraph(
        "The backend is architected as six domain-driven Spring Boot 3.2 microservices operating in a decoupled mesh architecture:",
        body_style
    ))

    services_data = [
        [Paragraph("Microservice Engine", table_hdr), Paragraph("Port", table_hdr), Paragraph("Core Responsibilities", table_hdr), Paragraph("Key REST Endpoints", table_hdr)],
        [Paragraph("<b>Auth & Super Admin Gateway</b>", table_cell_bold), Paragraph("8080", table_cell_bold), Paragraph("Master JWT issuing, password management, role registration approval queue, audit streaming.", table_cell), Paragraph("`/api/auth/login`<br/>`/api/admin/requests`<br/>`/api/admin/users/status`", table_cell)],
        [Paragraph("<b>School & Institution Service</b>", table_cell_bold), Paragraph("8081", table_cell_bold), Paragraph("School/college catalog, student admissions, grade rosters, academic calendar sync.", table_cell), Paragraph("`/api/schools`<br/>`/api/schools/{id}/students`", table_cell)],
        [Paragraph("<b>Fleet & Cab Service</b>", table_cell_bold), Paragraph("8082", table_cell_bold), Paragraph("Vehicle compliance docs, maintenance logs, fleet agency profiles, capacity limits.", table_cell), Paragraph("`/api/fleet/vehicles`<br/>`/api/fleet/compliance`", table_cell)],
        [Paragraph("<b>Student & Booking Service</b>", table_cell_bold), Paragraph("8083", table_cell_bold), Paragraph("Daily commute bookings, single-trip 45s dispatch requests, Razorpay fee subscriptions.", table_cell), Paragraph("`/api/bookings/create`<br/>`/api/subscriptions/pay`", table_cell)],
        [Paragraph("<b>Driver & Telemetry Service</b>", table_cell_bold), Paragraph("8084", table_cell_bold), Paragraph("GPS telemetry ingestion, geofence trigger evaluation, student boarding roster updates.", table_cell), Paragraph("`/api/driver/telemetry`<br/>`/api/driver/roster/board`", table_cell)],
        [Paragraph("<b>Parent & Notification Gateway</b>", table_cell_bold), Paragraph("8085", table_cell_bold), Paragraph("Live vehicle radar proxy, proximity push alert dispatcher, driver emergency call link.", table_cell), Paragraph("`/api/parent/radar/{id}`<br/>`/api/parent/leave`", table_cell)]
    ]
    srv_tbl = Table(services_data, colWidths=[110, 40, 184, 170])
    srv_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(srv_tbl)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 26 & 27: SECTION 11 - DATABASE SCHEMA
    # =========================================================================
    story.append(Paragraph("Section 11: Database Architecture & MySQL Relational Schema", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("11.1 Relational Entity Data Models", h2_style))
    story.append(Paragraph(
        "Persistence is managed via MySQL 8.0 with InnoDB foreign key constraints, B-Tree indexes on geographical coordinates, and transactional ACID guarantees:",
        body_style
    ))

    db_tables = [
        [Paragraph("Table Name", table_hdr), Paragraph("Primary Key", table_hdr), Paragraph("Foreign Keys", table_hdr), Paragraph("Key Fields & Indexes", table_hdr)],
        [Paragraph("`users`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("—", table_cell), Paragraph("`username`, `email`, `password_hash`, `role`, `status`, `phone`", table_cell)],
        [Paragraph("`institutions`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("—", table_cell), Paragraph("`name`, `code`, `type` (SCHOOL/COLLEGE), `latitude`, `longitude`, `contact`", table_cell)],
        [Paragraph("`vehicles`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("`owner_id`", table_cell), Paragraph("`plate_number`, `vehicle_type`, `capacity`, `fc_expiry`, `insurance_expiry`", table_cell)],
        [Paragraph("`drivers`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("`user_id`, `vehicle_id`", table_cell), Paragraph("`license_number`, `badge_number`, `rating`, `duty_status`", table_cell)],
        [Paragraph("`routes`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("`institution_id`", table_cell), Paragraph("`route_name`, `start_time`, `end_time`, `polyline_geojson`", table_cell)],
        [Paragraph("`route_stops`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("`route_id`", table_cell), Paragraph("`stop_name`, `sequence_order`, `latitude`, `longitude`, `expected_time`", table_cell)],
        [Paragraph("`students`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("`parent_id`, `institution_id`, `stop_id`", table_cell), Paragraph("`first_name`, `last_name`, `grade`, `roll_number`, `status`", table_cell)],
        [Paragraph("`telemetry_logs`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("`vehicle_id`, `driver_id`", table_cell), Paragraph("`latitude`, `longitude`, `speed_kmh`, `heading`, `recorded_at`", table_cell)],
        [Paragraph("`payments`", table_cell_bold), Paragraph("`id` (BIGINT)", table_cell), Paragraph("`user_id`, `student_id`", table_cell), Paragraph("`razorpay_order_id`, `amount`, `status`, `payment_date`", table_cell)]
    ]
    db_tbl = Table(db_tables, colWidths=[90, 75, 110, 229])
    db_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(db_tbl)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 28, 29, 30: SECTION 12 - OPERATIONAL RUNBOOK & VERIFICATION MATRIX
    # =========================================================================
    story.append(Paragraph("Section 12: Operational Runbook, Desktop Launchers & Verification Matrix", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BLUE, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("12.1 1-Click Desktop Launchers Directory", h2_style))
    story.append(Paragraph(
        "All application components and background services are accessible via preconfigured 1-click desktop batch launchers:",
        body_style
    ))

    launchers_data = [
        [Paragraph("Launcher Shortcut", table_hdr), Paragraph("Target Component", table_hdr), Paragraph("Operational Actions Automated", table_hdr)],
        [Paragraph("<b>`Launch_App.bat`</b>", table_cell_bold), Paragraph("Backends & Web Portal", table_cell), Paragraph("Starts MySQL check, launches Spring Boot microservices, boots Vite web prototype on `localhost:5173`.", table_cell)],
        [Paragraph("<b>`Run_Parent_App.bat`</b>", table_cell_bold), Paragraph("Parent Mobile App", table_cell), Paragraph("Boots Android Emulator with SwiftShader GPU, sets port reverse (8092 & 8085), starts Metro, installs debug APK.", table_cell)],
        [Paragraph("<b>`Run_Driver_App.bat`</b>", table_cell_bold), Paragraph("Driver Mobile App", table_cell), Paragraph("Boots Android Emulator, sets port reverse (8091 & 8084), starts driver Metro bundler, installs driver APK.", table_cell)],
        [Paragraph("<b>`Start_Android_Emulator.bat`</b>", table_cell_bold), Paragraph("Standalone Emulator", table_cell), Paragraph("1-Click standalone GUI launcher for `Pixel_3a_API_34_extension_level_7_x86_64` virtual device.", table_cell)]
    ]
    l_tbl = Table(launchers_data, colWidths=[120, 110, 274])
    l_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(l_tbl)

    story.append(Spacer(1, 10))
    story.append(Paragraph("12.2 System Verification & Compliance Sign-Off", h2_style))

    checks_data = [
        [Paragraph("Subsystem / Capability", table_hdr), Paragraph("Validation Method", table_hdr), Paragraph("Verification Result", table_hdr)],
        [Paragraph("Unified Role-Based Gateway", table_cell_bold), Paragraph("Manual credential entry tested across all 6 personas.", table_cell), Paragraph("PASS ✅ (Strict Auth Active)", table_cell_bold)],
        [Paragraph("Direct Super Admin Approval", table_cell_bold), Paragraph("⚡ 30-min urgent & 📅 tomorrow batch workflows tested.", table_cell), Paragraph("PASS ✅ (Instant Sign-in)", table_cell_bold)],
        [Paragraph("Android Emulator Automation", table_cell_bold), Paragraph("SwiftShader GPU boots without Intel UHD crashes.", table_cell), Paragraph("PASS ✅ (Pixel 3a Online)", table_cell_bold)],
        [Paragraph("React Native Parent APK", table_cell_bold), Paragraph("Build debug APK on port 8092, verified screen capture.", table_cell), Paragraph("PASS ✅ (Render Verified)", table_cell_bold)],
        [Paragraph("React Native Driver APK", table_cell_bold), Paragraph("Build debug APK on port 8091, 45s dispatch ready.", table_cell), Paragraph("PASS ✅ (Cockpit Verified)", table_cell_bold)],
        [Paragraph("Web Prototype Build", table_cell_bold), Paragraph("TypeScript compile + Vite build (1826 modules).", table_cell), Paragraph("PASS ✅ (0 Errors)", table_cell_bold)],
        [Paragraph("Spring Boot Microservices", table_cell_bold), Paragraph("Maven wrapper clean build on Java 17.", table_cell), Paragraph("PASS ✅ (All 6 Services)", table_cell_bold)],
        [Paragraph("MySQL Relational Schema", table_cell_bold), Paragraph("DDL schema integrity and foreign key constraints.", table_cell), Paragraph("PASS ✅ (Production Ready)", table_cell_bold)]
    ]
    chk_tbl = Table(checks_data, colWidths=[130, 240, 134])
    chk_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(chk_tbl)

    story.append(Spacer(1, 14))
    story.append(make_callout(
        "<b>Architectural Sign-off:</b> The SafePassage AI platform has completed end-to-end integration across all frontends, mobile APKs, microservices, and databases. This master brochure document serves as the official operational reference and system workflow specification.",
        title="FINAL ARCHITECTURAL COMPLIANCE & APPROVAL",
        bg=colors.HexColor("#F0FDF4"),
        border=C_GREEN
    ))

    # Build document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Master brochure PDF generated successfully: {filename}")

if __name__ == '__main__':
    out_pdf = "SafePassage_AI_Master_Workflow_Brochure_Documentation.pdf"
    if len(sys.argv) > 1:
        out_pdf = sys.argv[1]
    build_pdf_brochure(out_pdf)
