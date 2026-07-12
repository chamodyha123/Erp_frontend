// ============================================
// CORE SYSTEM (FOUNDATION)
// ============================================

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  department: string;
  companyId: string; // Multi-Entity support
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  companyId: string;
  createdAt: Date;
}

export interface Permission {
  id: string;
  module: string;
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  resource: string;
  resourceId: string;
  changes: Record<string, any>;
  ipAddress: string;
  timestamp: Date;
}

export interface SystemSettings {
  id: string;
  category: string;
  key: string;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  updatedBy: string;
  updatedAt: Date;
}

// Multi-Entity/Company Support
export interface Company {
  id: string;
  companyCode: string;
  name: string;
  legalName: string;
  taxId: string;
  registrationNumber: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
  baseCurrency: string;
  fiscalYearStart: string; // MM-DD format
  timezone: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Branch {
  id: string;
  branchCode: string;
  companyId: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  managerId?: string;
  isHeadOffice: boolean;
  isActive: boolean;
  createdAt: Date;
}

// Currency Management
export interface Currency {
  id: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  decimalPlaces: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: Date;
  source: 'Manual' | 'Auto-Import' | 'API';
  createdBy?: string;
  createdAt: Date;
}

// Tax Engine
export interface TaxConfiguration {
  id: string;
  taxCode: string;
  taxName: string;
  taxType: 'VAT' | 'Sales Tax' | 'Withholding Tax' | 'Excise Tax' | 'Custom Duty';
  rate: number;
  isCompound: boolean;
  basedOn?: string; // for compound taxes
  country: string;
  region?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  accountId: string; // GL account for tax
  isActive: boolean;
  description: string;
  createdAt: Date;
}

export interface TaxRule {
  id: string;
  taxConfigId: string;
  applicableTo: 'Sale' | 'Purchase' | 'Both';
  customerCategory?: string;
  vendorCategory?: string;
  productCategory?: string;
  minimumAmount?: number;
  maximumAmount?: number;
  priority: number;
  createdAt: Date;
}

// Approval Workflow Engine
export interface ApprovalWorkflow {
  id: string;
  workflowName: string;
  module: string;
  documentType: string;
  description: string;
  isActive: boolean;
  conditions: WorkflowCondition[];
  levels: ApprovalLevel[];
  createdAt: Date;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface ApprovalLevel {
  level: number;
  approverType: 'User' | 'Role' | 'Manager' | 'Department Head';
  approverId?: string;
  approverRoleId?: string;
  isSequential: boolean;
  requiredApprovers: number; // for parallel approvals
  autoApproveAfterHours?: number;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  documentType: string;
  documentId: string;
  documentNumber: string;
  requestedBy: string;
  requestedAt: Date;
  currentLevel: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvals: ApprovalHistory[];
  notes: string;
}

export interface ApprovalHistory {
  level: number;
  approverId: string;
  action: 'Approved' | 'Rejected' | 'Returned';
  comments: string;
  actionDate: Date;
}

// ============================================
// FINANCE MODULE
// ============================================

export interface ChartOfAccounts {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  accountSubType: string;
  parentAccountId?: string;
  isActive: boolean;
  balance: number;
  currency: string;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  journalNumber: string;
  date: Date;
  reference: string;
  description: string;
  status: 'Draft' | 'Posted' | 'Cancelled';
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  postedBy?: string;
  postedAt?: Date;
  createdAt: Date;
}

export interface JournalLine {
  id: string;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
  costCenterId?: string;
  projectId?: string;
}

export interface AccountsPayable {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  amountPaid: number;
  amountDue: number;
  status: 'Open' | 'Partial' | 'Paid' | 'Overdue';
  paymentTerms: string;
  reference: string;
  notes: string;
  createdAt: Date;
}

export interface AccountsReceivable {
  id: string;
  invoiceNumber: string;
  customerId: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  amountPaid: number;
  amountDue: number;
  status: 'Open' | 'Partial' | 'Paid' | 'Overdue';
  paymentTerms: string;
  reference: string;
  notes: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  budgetName: string;
  fiscalYear: string;
  department: string;
  accountId: string;
  periodType: 'Monthly' | 'Quarterly' | 'Annually';
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  status: 'Draft' | 'Approved' | 'Active' | 'Closed';
  createdAt: Date;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  paymentDate: Date;
  paymentMethod: 'Cash' | 'Check' | 'Bank Transfer' | 'Credit Card';
  amount: number;
  currency: string;
  reference: string;
  bankAccountId: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: Date;
}

// Cash & Bank Management
export interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankBranch: string;
  accountType: 'Checking' | 'Savings' | 'Credit Card' | 'Line of Credit';
  currency: string;
  currentBalance: number;
  openingBalance: number;
  openingDate: Date;
  glAccountId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface BankTransaction {
  id: string;
  transactionNumber: string;
  bankAccountId: string;
  transactionDate: Date;
  transactionType: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Fee' | 'Interest';
  amount: number;
  balance: number;
  payee?: string;
  reference: string;
  description: string;
  isReconciled: boolean;
  reconciledDate?: Date;
  createdAt: Date;
}

export interface BankReconciliation {
  id: string;
  reconciliationNumber: string;
  bankAccountId: string;
  periodStart: Date;
  periodEnd: Date;
  statementBalance: number;
  bookBalance: number;
  difference: number;
  status: 'In Progress' | 'Completed' | 'Reviewed';
  reconciledBy?: string;
  reconciledAt?: Date;
  notes: string;
  createdAt: Date;
}

// Fixed Assets
export interface FixedAsset {
  id: string;
  assetNumber: string;
  name: string;
  description: string;
  assetClass: string;
  acquisitionDate: Date;
  purchaseCost: number;
  residualValue: number;
  usefulLife: number;
  depreciationMethod: 'Straight Line' | 'Declining Balance' | 'Units of Production' | 'Sum of Years Digits';
  depreciationRate: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  glAccountId: string;
  depreciationAccountId: string;
  locationId: string;
  departmentId?: string;
  employeeId?: string;
  status: 'Active' | 'Fully Depreciated' | 'Disposed' | 'Under Construction';
  notes: string;
  createdAt: Date;
}

// Financial Reports
export interface FinancialReport {
  id: string;
  reportType: 'Balance Sheet' | 'Income Statement' | 'Cash Flow' | 'Trial Balance' | 'General Ledger';
  fiscalYear: string;
  periodStart: Date;
  periodEnd: Date;
  companyId: string;
  generatedBy: string;
  generatedAt: Date;
  data: any; // Report-specific data structure
  status: 'Draft' | 'Final';
}

export interface BalanceSheet {
  reportDate: Date;
  assets: {
    currentAssets: AccountBalance[];
    fixedAssets: AccountBalance[];
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: AccountBalance[];
    longTermLiabilities: AccountBalance[];
    totalLiabilities: number;
  };
  equity: {
    capitalAccounts: AccountBalance[];
    retainedEarnings: number;
    totalEquity: number;
  };
}

export interface IncomeStatement {
  periodStart: Date;
  periodEnd: Date;
  revenue: AccountBalance[];
  totalRevenue: number;
  costOfGoodsSold: AccountBalance[];
  totalCOGS: number;
  grossProfit: number;
  operatingExpenses: AccountBalance[];
  totalOperatingExpenses: number;
  operatingIncome: number;
  otherIncome: AccountBalance[];
  otherExpenses: AccountBalance[];
  netIncome: number;
}

export interface CashFlowStatement {
  periodStart: Date;
  periodEnd: Date;
  operatingActivities: CashFlowItem[];
  netCashFromOperating: number;
  investingActivities: CashFlowItem[];
  netCashFromInvesting: number;
  financingActivities: CashFlowItem[];
  netCashFromFinancing: number;
  netCashFlow: number;
  openingCash: number;
  closingCash: number;
}

export interface CashFlowItem {
  description: string;
  amount: number;
}

export interface AccountBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  balance: number;
}

// Fiscal Closing
export interface FiscalPeriod {
  id: string;
  periodNumber: string;
  fiscalYear: string;
  periodStart: Date;
  periodEnd: Date;
  status: 'Open' | 'Closed' | 'Locked';
  closedBy?: string;
  closedAt?: Date;
  notes: string;
  createdAt: Date;
}

export interface PeriodClosing {
  id: string;
  periodId: string;
  closingType: 'Month-End' | 'Quarter-End' | 'Year-End';
  closingDate: Date;
  closedBy: string;
  checklist: ClosingChecklistItem[];
  status: 'In Progress' | 'Completed';
  completedAt?: Date;
}

export interface ClosingChecklistItem {
  task: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
}

// Multi-Currency Revaluation
export interface CurrencyRevaluation {
  id: string;
  revaluationNumber: string;
  revaluationDate: Date;
  fromCurrency: string;
  toCurrency: string;
  oldRate: number;
  newRate: number;
  unrealizedGainLoss: number;
  accounts: RevaluationAccount[];
  status: 'Draft' | 'Posted' | 'Reversed';
  postedBy?: string;
  createdAt: Date;
}

export interface RevaluationAccount {
  accountId: string;
  originalAmount: number;
  revaluedAmount: number;
  gainLoss: number;
}

// Treasury/Cash Management
export interface CashPosition {
  id: string;
  date: Date;
  currency: string;
  openingBalance: number;
  totalInflows: number;
  totalOutflows: number;
  closingBalance: number;
  bankAccounts: BankAccountPosition[];
  projectedCashFlow?: ProjectedCashFlow[];
}

export interface BankAccountPosition {
  bankAccountId: string;
  accountName: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

export interface ProjectedCashFlow {
  date: Date;
  projectedInflow: number;
  projectedOutflow: number;
  projectedBalance: number;
}

// ============================================
// SALES MODULE
// ============================================

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  taxId: string;
  paymentTerms: string;
  creditLimit: number;
  customerType: 'Individual' | 'Corporate';
  status: 'Active' | 'Inactive' | 'Blocked';
  createdAt: Date;
}

export interface SalesQuotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  quotationDate: Date;
  expiryDate: Date;
  items: SalesLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  notes: string;
  createdBy: string;
  createdAt: Date;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  orderDate: Date;
  deliveryDate: Date;
  items: SalesLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  status: 'Draft' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  shippingAddress: Address;
  notes: string;
  createdBy: string;
  createdAt: Date;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  salesOrderId?: string;
  invoiceDate: Date;
  dueDate: Date;
  items: SalesLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: 'Draft' | 'Sent' | 'Partial' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentTerms: string;
  notes: string;
  createdAt: Date;
}

export interface SalesLineItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  lineTotal: number;
}

// Delivery Order & Sales Return
export interface DeliveryOrder {
  id: string;
  deliveryNumber: string;
  salesOrderId: string;
  customerId: string;
  deliveryDate: Date;
  items: DeliveryLineItem[];
  shippingAddress: Address;
  carrier?: string;
  trackingNumber?: string;
  status: 'Draft' | 'Ready to Ship' | 'In Transit' | 'Delivered' | 'Cancelled';
  deliveredBy?: string;
  receivedBy?: string;
  notes: string;
  createdAt: Date;
}

export interface DeliveryLineItem {
  id: string;
  salesOrderLineId: string;
  productId: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  warehouseId: string;
}

export interface SalesReturn {
  id: string;
  returnNumber: string;
  salesInvoiceId?: string;
  salesOrderId?: string;
  customerId: string;
  returnDate: Date;
  items: SalesReturnLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  refundMethod: 'Credit Note' | 'Cash Refund' | 'Exchange';
  status: 'Draft' | 'Approved' | 'Completed' | 'Rejected';
  reason: string;
  approvedBy?: string;
  notes: string;
  createdAt: Date;
}

export interface SalesReturnLineItem {
  id: string;
  productId: string;
  description: string;
  returnedQuantity: number;
  unitPrice: number;
  condition: 'New' | 'Damaged' | 'Defective';
  lineTotal: number;
}

// Sales - Pricing Engine
export interface PriceList {
  id: string;
  priceListCode: string;
  name: string;
  description: string;
  currency: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  priceListItems: PriceListItem[];
  applicableCustomers?: string[];
  applicableRegions?: string[];
  createdAt: Date;
}

export interface PriceListItem {
  productId: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  minimumQuantity?: number;
}

export interface DiscountRule {
  id: string;
  ruleCode: string;
  name: string;
  discountType: 'Percentage' | 'Fixed Amount' | 'Buy X Get Y';
  discountValue: number;
  conditions: DiscountCondition[];
  startDate: Date;
  endDate?: Date;
  priority: number;
  isActive: boolean;
  createdAt: Date;
}

export interface DiscountCondition {
  conditionType: 'Quantity' | 'Amount' | 'Customer Type' | 'Product Category';
  operator: 'Greater Than' | 'Less Than' | 'Equals' | 'Between';
  value: any;
}

// Credit Control
export interface CreditLimit {
  id: string;
  customerId: string;
  creditLimit: number;
  availableCredit: number;
  usedCredit: number;
  creditTerms: string;
  lastReviewDate: Date;
  nextReviewDate: Date;
  status: 'Active' | 'On Hold' | 'Blocked';
  notes: string;
}

export interface CreditBlock {
  id: string;
  customerId: string;
  blockReason: 'Exceeded Limit' | 'Overdue Payment' | 'Manual Block';
  blockedDate: Date;
  blockedBy: string;
  unblockedDate?: Date;
  unblockedBy?: string;
  status: 'Active' | 'Released';
  notes: string;
}

// Sales Commission
export interface CommissionScheme {
  id: string;
  schemeCode: string;
  name: string;
  calculationMethod: 'Percentage of Sales' | 'Percentage of Margin' | 'Tiered' | 'Flat Rate';
  rate: number;
  tiers?: CommissionTier[];
  applicableTo: string[]; // sales rep IDs
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
}

export interface CommissionTier {
  fromAmount: number;
  toAmount?: number;
  rate: number;
}

export interface CommissionCalculation {
  id: string;
  calculationNumber: string;
  salesRepId: string;
  periodStart: Date;
  periodEnd: Date;
  totalSales: number;
  commissionableAmount: number;
  commissionRate: number;
  totalCommission: number;
  status: 'Draft' | 'Approved' | 'Paid';
  salesTransactions: CommissionTransaction[];
  createdAt: Date;
}

export interface CommissionTransaction {
  invoiceId: string;
  invoiceNumber: string;
  saleAmount: number;
  commissionAmount: number;
}

// Payment Collection
export interface CustomerPayment {
  id: string;
  paymentNumber: string;
  customerId: string;
  paymentDate: Date;
  paymentMethod: 'Cash' | 'Check' | 'Bank Transfer' | 'Credit Card' | 'Digital Wallet';
  amount: number;
  currency: string;
  bankAccountId?: string;
  reference: string;
  allocations: PaymentAllocation[];
  unappliedAmount: number;
  status: 'Pending' | 'Cleared' | 'Bounced' | 'Cancelled';
  createdAt: Date;
}

export interface PaymentAllocation {
  invoiceId: string;
  invoiceNumber: string;
  invoiceAmount: number;
  allocationAmount: number;
}

// ============================================
// PURCHASING MODULE
// ============================================

export interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  taxId: string;
  paymentTerms: string;
  vendorType: 'Supplier' | 'Contractor' | 'Service Provider';
  status: 'Active' | 'Inactive' | 'Blocked';
  rating: number;
  createdAt: Date;
}

export interface PurchaseRequisition {
  id: string;
  requisitionNumber: string;
  requestedBy: string;
  department: string;
  requestDate: Date;
  requiredDate: Date;
  items: PurchaseLineItem[];
  totalAmount: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Converted';
  approvedBy?: string;
  approvedAt?: Date;
  notes: string;
  createdAt: Date;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  requisitionId?: string;
  orderDate: Date;
  deliveryDate: Date;
  items: PurchaseLineItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Partial Receipt' | 'Received' | 'Cancelled';
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  shippingAddress: Address;
  notes: string;
  createdBy: string;
  createdAt: Date;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  purchaseOrderId?: string;
  invoiceDate: Date;
  dueDate: Date;
  items: PurchaseLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid' | 'Cancelled';
  paymentTerms: string;
  notes: string;
  createdAt: Date;
}

export interface PurchaseLineItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  lineTotal: number;
}

// Goods Receipt & Purchase Return
export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  purchaseOrderId: string;
  vendorId: string;
  receiptDate: Date;
  items: GoodsReceiptLineItem[];
  receivedBy: string;
  warehouseId: string;
  status: 'Draft' | 'Completed' | 'Cancelled';
  notes: string;
  createdAt: Date;
}

export interface GoodsReceiptLineItem {
  id: string;
  purchaseOrderLineId: string;
  productId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  batchNumber?: string;
  expiryDate?: Date;
}

export interface PurchaseReturn {
  id: string;
  returnNumber: string;
  purchaseOrderId?: string;
  vendorId: string;
  returnDate: Date;
  items: PurchaseReturnLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  refundMethod: 'Debit Note' | 'Credit Adjustment' | 'Exchange';
  status: 'Draft' | 'Approved' | 'Completed' | 'Rejected';
  reason: string;
  approvedBy?: string;
  notes: string;
  createdAt: Date;
}

export interface PurchaseReturnLineItem {
  id: string;
  productId: string;
  description: string;
  returnedQuantity: number;
  unitPrice: number;
  condition: 'Defective' | 'Wrong Item' | 'Excess Quantity' | 'Damaged';
  lineTotal: number;
}

// Procurement Strategy
export interface VendorPriceList {
  id: string;
  vendorId: string;
  productId: string;
  unitPrice: number;
  minimumOrderQuantity: number;
  leadTimeDays: number;
  currency: string;
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
}

// 3-Way Matching
export interface ThreeWayMatch {
  id: string;
  matchNumber: string;
  purchaseOrderId: string;
  goodsReceiptId: string;
  invoiceId: string;
  matchDate: Date;
  status: 'Matched' | 'Variance' | 'Rejected';
  variances: MatchVariance[];
  matchedBy: string;
  notes: string;
  createdAt: Date;
}

export interface MatchVariance {
  lineItemId: string;
  varianceType: 'Quantity' | 'Price' | 'Tax' | 'Total';
  poValue: number;
  grnValue: number;
  invoiceValue: number;
  varianceAmount: number;
  tolerancePercent: number;
  withinTolerance: boolean;
}

// ============================================
// INVENTORY MODULE
// ============================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  unitOfMeasure: string;
  productType: 'Finished Goods' | 'Raw Material' | 'Component' | 'Service';
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  reorderQuantity: number;
  leadTime: number;
  barcode?: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  isActive: boolean;
  createdAt: Date;
}

export interface Warehouse {
  id: string;
  warehouseCode: string;
  name: string;
  location: string;
  address: Address;
  warehouseType: 'Main' | 'Transit' | 'Returns';
  capacity: number;
  managerId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface StockLevel {
  id: string;
  productId: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  minimumStock: number;
  maximumStock: number;
  lastStockCount: Date;
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  movementNumber: string;
  movementType: 'Receipt' | 'Issue' | 'Transfer' | 'Adjustment' | 'Return';
  productId: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reference: string;
  reason: string;
  movementDate: Date;
  createdBy: string;
  createdAt: Date;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  transferDate: Date;
  expectedDeliveryDate: Date;
  items: TransferLineItem[];
  status: 'Draft' | 'Pending' | 'In Transit' | 'Received' | 'Cancelled';
  notes: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
}

export interface TransferLineItem {
  id: string;
  productId: string;
  quantity: number;
  receivedQuantity?: number;
}

// Batch/Serial Tracking & Stock Valuation
export interface BatchSerial {
  id: string;
  batchSerialNumber: string;
  productId: string;
  warehouseId: string;
  type: 'Batch' | 'Serial';
  quantity: number;
  manufactureDate?: Date;
  expiryDate?: Date;
  status: 'Available' | 'Reserved' | 'Sold' | 'Expired' | 'Damaged';
  purchaseCost: number;
  supplierId?: string;
  notes: string;
  createdAt: Date;
}

export interface StockValuation {
  id: string;
  valuationNumber: string;
  productId: string;
  warehouseId: string;
  valuationDate: Date;
  valuationMethod: 'FIFO' | 'LIFO' | 'Average Cost' | 'Specific Identification';
  quantityOnHand: number;
  averageCost: number;
  totalValue: number;
  layers: ValuationLayer[];
  createdAt: Date;
}

export interface ValuationLayer {
  purchaseDate: Date;
  quantity: number;
  unitCost: number;
  totalCost: number;
  remainingQuantity: number;
}

// ============================================
// MANUFACTURING MODULE
// ============================================

export interface BillOfMaterials {
  id: string;
  bomNumber: string;
  productId: string;
  version: string;
  components: BOMComponent[];
  totalCost: number;
  isActive: boolean;
  effectiveDate: Date;
  expiryDate?: Date;
  notes: string;
  createdAt: Date;
}

export interface BOMComponent {
  id: string;
  componentProductId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  scrapPercent: number;
  isOptional: boolean;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  productId: string;
  bomId: string;
  quantity: number;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: 'Draft' | 'Released' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  workCenterId: string;
  assignedTo?: string;
  notes: string;
  createdBy: string;
  createdAt: Date;
}

export interface ProductionOrder {
  id: string;
  productionNumber: string;
  workOrderId: string;
  productId: string;
  plannedQuantity: number;
  producedQuantity: number;
  rejectedQuantity: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  startTime: Date;
  endTime?: Date;
  actualDuration?: number;
  workCenterId: string;
  operatorId: string;
  notes: string;
  createdAt: Date;
}

export interface WorkCenter {
  id: string;
  workCenterCode: string;
  name: string;
  description: string;
  capacity: number;
  costPerHour: number;
  efficiency: number;
  isActive: boolean;
  createdAt: Date;
}

export interface QualityControl {
  id: string;
  inspectionNumber: string;
  productionOrderId?: string;
  productId: string;
  inspectionType: 'Incoming' | 'In-Process' | 'Final' | 'Random';
  inspectionDate: Date;
  inspectedBy: string;
  quantityInspected: number;
  quantityPassed: number;
  quantityFailed: number;
  status: 'Passed' | 'Failed' | 'Conditional';
  defects: QualityDefect[];
  notes: string;
  createdAt: Date;
}

export interface QualityDefect {
  id: string;
  defectType: string;
  severity: 'Minor' | 'Major' | 'Critical';
  quantity: number;
  description: string;
}

// ============================================
// HR MODULE
// ============================================

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  address: Address;
  hireDate: Date;
  terminationDate?: Date;
  departmentId: string;
  positionId: string;
  managerId?: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  status: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
  salary: number;
  bankAccount: string;
  taxId: string;
  emergencyContact: EmergencyContact;
  createdAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Department {
  id: string;
  departmentCode: string;
  name: string;
  description: string;
  managerId?: string;
  parentDepartmentId?: string;
  costCenterId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Position {
  id: string;
  positionCode: string;
  title: string;
  description: string;
  departmentId: string;
  level: string;
  minSalary: number;
  maxSalary: number;
  requirements: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  workHours: number;
  overtimeHours: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Leave';
  notes: string;
  createdAt: Date;
}

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Other';
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export interface Payroll {
  id: string;
  payrollNumber: string;
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  basicSalary: number;
  allowances: PayrollComponent[];
  deductions: PayrollComponent[];
  overtimePay: number;
  grossPay: number;
  netPay: number;
  status: 'Draft' | 'Approved' | 'Paid';
  createdAt: Date;
}

export interface PayrollComponent {
  name: string;
  amount: number;
  type: 'Fixed' | 'Variable';
}

export interface Recruitment {
  id: string;
  jobRequisitionNumber: string;
  positionId: string;
  numberOfOpenings: number;
  requiredDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'On Hold' | 'Closed' | 'Cancelled';
  requestedBy: string;
  approvedBy?: string;
  jobDescription: string;
  requirements: string[];
  createdAt: Date;
}

export interface Applicant {
  id: string;
  requisitionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  applicationDate: Date;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  currentStage: string;
  rating?: number;
  notes: string;
  createdAt: Date;
}

// ============================================
// CRM MODULE
// ============================================

export interface Lead {
  id: string;
  leadNumber: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Trade Show' | 'Cold Call' | 'Social Media' | 'Other';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  rating: 'Hot' | 'Warm' | 'Cold';
  estimatedValue: number;
  assignedTo: string;
  notes: string;
  createdAt: Date;
}

export interface Opportunity {
  id: string;
  opportunityNumber: string;
  name: string;
  customerId?: string;
  leadId?: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  value: number;
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  assignedTo: string;
  products: OpportunityProduct[];
  competitors: string[];
  notes: string;
  createdAt: Date;
}

export interface OpportunityProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface Activity {
  id: string;
  activityType: 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note';
  subject: string;
  description: string;
  relatedTo: 'Lead' | 'Opportunity' | 'Customer' | 'Contact';
  relatedId: string;
  assignedTo: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  completedDate?: Date;
  duration?: number;
  outcome?: string;
  createdAt: Date;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  customerId?: string;
  email: string;
  phone: string;
  mobile?: string;
  title: string;
  department: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  campaignNumber: string;
  name: string;
  type: 'Email' | 'Social Media' | 'Event' | 'Webinar' | 'Direct Mail' | 'Other';
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  startDate: Date;
  endDate: Date;
  budget: number;
  actualCost: number;
  targetAudience: string;
  expectedResponse: number;
  actualResponse: number;
  leadsGenerated: number;
  assignedTo: string;
  description: string;
  createdAt: Date;
}

// ============================================
// PROJECT MANAGEMENT MODULE
// ============================================

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  description: string;
  customerId?: string;
  projectManager: string;
  startDate: Date;
  endDate: Date;
  actualEndDate?: Date;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High';
  budget: number;
  actualCost: number;
  progress: number;
  teamMembers: string[];
  tags: string[];
  createdAt: Date;
}

export interface Task {
  id: string;
  taskNumber: string;
  projectId: string;
  parentTaskId?: string;
  name: string;
  description: string;
  assignedTo: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  estimatedHours: number;
  actualHours: number;
  startDate: Date;
  dueDate: Date;
  completedDate?: Date;
  progress: number;
  dependencies: string[];
  attachments: string[];
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  taskId?: string;
  date: Date;
  hours: number;
  description: string;
  billable: boolean;
  hourlyRate?: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Delayed';
  deliverables: string[];
  createdAt: Date;
}

export interface ProjectResource {
  id: string;
  projectId: string;
  resourceType: 'Employee' | 'Equipment' | 'Material' | 'Other';
  resourceId: string;
  allocationPercent: number;
  startDate: Date;
  endDate: Date;
  cost: number;
  createdAt: Date;
}

// ============================================
// ASSET MANAGEMENT MODULE
// ============================================

export interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  description: string;
  category: string;
  assetType: 'Fixed Asset' | 'Current Asset' | 'Intangible Asset';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired' | 'Disposed';
  acquisitionDate: Date;
  acquisitionCost: number;
  currentValue: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: 'Straight Line' | 'Declining Balance' | 'Units of Production';
  location: string;
  assignedTo?: string;
  departmentId?: string;
  vendor?: string;
  serialNumber?: string;
  warrantyExpiry?: Date;
  createdAt: Date;
}

export interface Depreciation {
  id: string;
  assetId: string;
  fiscalYear: string;
  period: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
  calculationDate: Date;
  status: 'Calculated' | 'Posted' | 'Reversed';
  createdAt: Date;
}

export interface Maintenance {
  id: string;
  maintenanceNumber: string;
  assetId: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Predictive' | 'Emergency';
  scheduledDate: Date;
  completedDate?: Date;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  description: string;
  technician?: string;
  cost: number;
  downtime?: number;
  notes: string;
  nextMaintenanceDate?: Date;
  createdAt: Date;
}

export interface AssetTransfer {
  id: string;
  transferNumber: string;
  assetId: string;
  fromLocation: string;
  toLocation: string;
  fromEmployee?: string;
  toEmployee?: string;
  fromDepartment?: string;
  toDepartment?: string;
  transferDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  approvedBy?: string;
  notes: string;
  createdAt: Date;
}

export interface AssetDisposal {
  id: string;
  disposalNumber: string;
  assetId: string;
  disposalDate: Date;
  disposalMethod: 'Sale' | 'Donation' | 'Scrap' | 'Trade-in';
  saleAmount?: number;
  buyerDetails?: string;
  reason: string;
  approvedBy: string;
  bookValue: number;
  gainLoss: number;
  status: 'Pending' | 'Approved' | 'Completed';
  notes: string;
  createdAt: Date;
}

// ============================================
// SHARED TYPES
// ============================================

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}