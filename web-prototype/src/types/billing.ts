export interface InvoiceItem {
  id: string;
  description: string;
  sacCode: string; // SAC 9964 for Passenger Transport Services
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0041
  recipientType: 'CAB_OWNER' | 'PARENT' | 'INSTITUTION';
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientGstin?: string;
  billingPeriod: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  platformCommissionRate: number; // e.g. 0.10 for 10%
  platformCommissionAmount: number;
  taxableAmount: number;
  cgstRate: number; // e.g. 0.025 (2.5%)
  cgstAmount: number;
  sgstRate: number; // e.g. 0.025 (2.5%)
  sgstAmount: number;
  totalGst: number;
  netPayable: number;
  status: 'PAID' | 'PENDING' | 'PROCESSING';
  paymentMethod: 'NEFT_RTGS' | 'UPI_INSTANT' | 'CARD_ONLINE' | 'BANK_TRANSFER';
  utrNumber?: string;
  notes?: string;
}

export interface FleetKpiData {
  fleetUtilizationRate: number; // e.g. 87.5%
  onTimeArrivalRate: number; // e.g. 99.2%
  activeCabsOnDuty: number;
  totalCabsInFleet: number;
  totalSeatsCapacity: number;
  totalSeatsFilled: number;
  grossWeeklyRevenue: number;
  netWeeklyPayout: number;
  avgDriverRating: number;
  maintenanceAlertCount: number;
  fuelEfficiencyKmPerLitre: number;
}

export interface PlatformKpiData {
  totalGmv: number; // Gross Merchandise Value
  platformNetRevenue: number; // 10% take
  totalVerifiedCabs: number;
  totalActiveCommuters: number;
  activeSchoolsAndCampuses: number;
  routeEfficiencyScore: number;
  safetyIncidentResolutionRate: number;
  monthlyGrowthPercent: number;
}

// Initial Mock Invoices for Cab Owner (Vendor Payout Disbursements)
export const MOCK_OWNER_INVOICES: Invoice[] = [
  {
    id: 'inv_own_001',
    invoiceNumber: 'INV-OWN-2026-0041',
    recipientType: 'CAB_OWNER',
    recipientName: 'Kumar Cab Owners Ltd. (M/S Kumar Swamy)',
    recipientEmail: 'kumar.cabs@safepassage.ai',
    recipientPhone: '+91 98401 23456',
    recipientAddress: '14/2 Anna Arch Main Road, Aminjikarai, Chennai, TN 600029',
    recipientGstin: '33AABCK1234F1Z2',
    billingPeriod: 'Aug 24 - Aug 30, 2026',
    issueDate: '31 Aug 2026',
    dueDate: '02 Sep 2026',
    items: [
      {
        id: 'it_1',
        description: 'Passenger Commute Route #4: Kasturba Nagar to ABC Matriculation School (Force Traveller TN 01 AB 1234)',
        sacCode: '9964',
        quantity: 1,
        unitPrice: 18400,
        amount: 18400
      },
      {
        id: 'it_2',
        description: 'Corporate Commute Corridor: Tambaram to Chennai IT Park Corridor (Maruti Ertiga TN 02 CD 5678)',
        sacCode: '9964',
        quantity: 1,
        unitPrice: 14000,
        amount: 14000
      }
    ],
    subtotal: 32400,
    platformCommissionRate: 0.10,
    platformCommissionAmount: 3240,
    taxableAmount: 29160,
    cgstRate: 0.025,
    cgstAmount: 729,
    sgstRate: 0.025,
    sgstAmount: 729,
    totalGst: 1458,
    netPayable: 29160,
    status: 'PAID',
    paymentMethod: 'NEFT_RTGS',
    utrNumber: 'HDFC260831994821',
    notes: 'Payout successfully credited to HDFC Bank A/C ending in 8492. SafePassage 10% platform facilitation fee applied.'
  },
  {
    id: 'inv_own_002',
    invoiceNumber: 'INV-OWN-2026-0038',
    recipientType: 'CAB_OWNER',
    recipientName: 'Kumar Cab Owners Ltd. (M/S Kumar Swamy)',
    recipientEmail: 'kumar.cabs@safepassage.ai',
    recipientPhone: '+91 98401 23456',
    recipientAddress: '14/2 Anna Arch Main Road, Aminjikarai, Chennai, TN 600029',
    recipientGstin: '33AABCK1234F1Z2',
    billingPeriod: 'Aug 17 - Aug 23, 2026',
    issueDate: '24 Aug 2026',
    dueDate: '26 Aug 2026',
    items: [
      {
        id: 'it_3',
        description: 'Passenger Commute Route #4: School & College Fleet Weekly Run',
        sacCode: '9964',
        quantity: 1,
        unitPrice: 28600,
        amount: 28600
      }
    ],
    subtotal: 28600,
    platformCommissionRate: 0.10,
    platformCommissionAmount: 2860,
    taxableAmount: 25740,
    cgstRate: 0.025,
    cgstAmount: 643.5,
    sgstRate: 0.025,
    sgstAmount: 643.5,
    totalGst: 1287,
    netPayable: 25740,
    status: 'PAID',
    paymentMethod: 'NEFT_RTGS',
    utrNumber: 'HDFC260824102941',
    notes: 'Payout cleared. TDS under Section 194C deducted at 1% for transport contractor.'
  },
  {
    id: 'inv_own_003',
    invoiceNumber: 'INV-OWN-2026-0045',
    recipientType: 'CAB_OWNER',
    recipientName: 'Kumar Cab Owners Ltd. (M/S Kumar Swamy)',
    recipientEmail: 'kumar.cabs@safepassage.ai',
    recipientPhone: '+91 98401 23456',
    recipientAddress: '14/2 Anna Arch Main Road, Aminjikarai, Chennai, TN 600029',
    recipientGstin: '33AABCK1234F1Z2',
    billingPeriod: 'Aug 31 - Sep 06, 2026 (Active Week)',
    issueDate: '02 Sep 2026',
    dueDate: '04 Sep 2026',
    items: [
      {
        id: 'it_4',
        description: 'Estimated Weekly Commute Collection - 4 Active Fleet Cabs',
        sacCode: '9964',
        quantity: 1,
        unitPrice: 34800,
        amount: 34800
      }
    ],
    subtotal: 34800,
    platformCommissionRate: 0.10,
    platformCommissionAmount: 3480,
    taxableAmount: 31320,
    cgstRate: 0.025,
    cgstAmount: 783,
    sgstRate: 0.025,
    sgstAmount: 783,
    totalGst: 1566,
    netPayable: 31320,
    status: 'PROCESSING',
    paymentMethod: 'NEFT_RTGS',
    utrNumber: 'PENDING_CLEARANCE',
    notes: 'Scheduled for automated Friday NEFT payout settlement directly to registered ICICI / HDFC vendor account.'
  }
];

// Initial Mock Invoices for Super Admin Master Ledger (Parent Subscriptions & Vendor Disbursements)
export const MOCK_ADMIN_ALL_INVOICES: Invoice[] = [
  ...MOCK_OWNER_INVOICES,
  {
    id: 'inv_par_001',
    invoiceNumber: 'INV-PAR-2026-1049',
    recipientType: 'PARENT',
    recipientName: 'Priya Sharma (Parent of Ananya Sharma)',
    recipientEmail: 'priya.sharma@gmail.com',
    recipientPhone: '+91 98765 43210',
    recipientAddress: 'Flat 402, Green Meadows, Kilpauk Garden Rd, Chennai 600010',
    billingPeriod: 'September 2026 (Monthly Plan)',
    issueDate: '01 Sep 2026',
    dueDate: '05 Sep 2026',
    items: [
      {
        id: 'it_p1',
        description: 'Monthly School Cab Subscription: Home ➔ ABC Matriculation School (Grade 4)',
        sacCode: '9964',
        quantity: 1,
        unitPrice: 3200,
        amount: 3200
      }
    ],
    subtotal: 3200,
    platformCommissionRate: 0,
    platformCommissionAmount: 0,
    taxableAmount: 3200,
    cgstRate: 0.025,
    cgstAmount: 80,
    sgstRate: 0.025,
    sgstAmount: 80,
    totalGst: 160,
    netPayable: 3360,
    status: 'PAID',
    paymentMethod: 'UPI_INSTANT',
    utrNumber: 'UPI984712038102',
    notes: 'Paid via Razorpay UPI auto-debit. Valid through 30 Sep 2026.'
  },
  {
    id: 'inv_par_002',
    invoiceNumber: 'INV-PAR-2026-1050',
    recipientType: 'PARENT',
    recipientName: 'Karthik Ramanathan (Parent of Arjun Ramanathan)',
    recipientEmail: 'karthik.r@outlook.com',
    recipientPhone: '+91 94441 98765',
    recipientAddress: '12B 4th Avenue, Anna Nagar, Chennai 600040',
    billingPeriod: 'September 2026 (Quarterly Term Plan)',
    issueDate: '01 Sep 2026',
    dueDate: '05 Sep 2026',
    items: [
      {
        id: 'it_p2',
        description: 'Quarterly Term Shuttle Pass (3 Months with 15% Sibling Discount applied)',
        sacCode: '9964',
        quantity: 1,
        unitPrice: 8500,
        amount: 8500
      }
    ],
    subtotal: 8500,
    platformCommissionRate: 0,
    platformCommissionAmount: 0,
    taxableAmount: 8500,
    cgstRate: 0.025,
    cgstAmount: 212.5,
    sgstRate: 0.025,
    sgstAmount: 212.5,
    totalGst: 425,
    netPayable: 8925,
    status: 'PAID',
    paymentMethod: 'CARD_ONLINE',
    utrNumber: 'TXN_RAZ_20260901_881',
    notes: 'Quarterly term billing cleared. Attendance tracking enabled for 2 terms.'
  },
  {
    id: 'inv_pro_001',
    invoiceNumber: 'INV-PRO-2026-0812',
    recipientType: 'INSTITUTION',
    recipientName: 'Vikram Malhotra (Faculty / IT Employee)',
    recipientEmail: 'vikram.m@techcorp.com',
    recipientPhone: '+91 98840 55667',
    recipientAddress: 'Tidel Park Campus, CSIR Road, Taramani, Chennai 600113',
    recipientGstin: '33AABCT9988P1Z9',
    billingPeriod: 'September 2026',
    issueDate: '02 Sep 2026',
    dueDate: '07 Sep 2026',
    items: [
      {
        id: 'it_pro1',
        description: 'Corporate Daily Carpool Shuttle Pass: Tambaram ➔ Siruseri IT Park Corridor',
        sacCode: '9964',
        quantity: 1,
        unitPrice: 2400,
        amount: 2400
      }
    ],
    subtotal: 2400,
    platformCommissionRate: 0,
    platformCommissionAmount: 0,
    taxableAmount: 2400,
    cgstRate: 0.025,
    cgstAmount: 60,
    sgstRate: 0.025,
    sgstAmount: 60,
    totalGst: 120,
    netPayable: 2520,
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    notes: 'Corporate reimbursement invoice generated for employee tax claim.'
  }
];
