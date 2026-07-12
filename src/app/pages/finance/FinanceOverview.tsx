import { DollarSign } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function FinanceOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Finance Module" 
        description="Comprehensive financial management including accounting, budgeting, and financial reporting"
        icon={<DollarSign className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Chart of Accounts"
          description="Defines the structure of the general ledger with account codes and hierarchies"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'accountCode', type: 'string', description: 'Account code (e.g., 1000, 2000)' },
            { name: 'accountName', type: 'string', description: 'Descriptive name' },
            { name: 'accountType', type: 'enum', description: 'Asset | Liability | Equity | Revenue | Expense' },
            { name: 'accountSubType', type: 'string', description: 'Further categorization' },
            { name: 'parentAccountId', type: 'string?', description: 'For hierarchical structure' },
            { name: 'balance', type: 'number', description: 'Current balance' },
            { name: 'currency', type: 'string', description: 'Currency code' },
          ]}
        />

        <DataStructure
          title="Journal Entry"
          description="Records all financial transactions with debit and credit entries"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'journalNumber', type: 'string', description: 'Sequential number' },
            { name: 'date', type: 'Date', description: 'Transaction date' },
            { name: 'reference', type: 'string', description: 'External reference' },
            { name: 'status', type: 'enum', description: 'Draft | Posted | Cancelled' },
            { name: 'lines', type: 'JournalLine[]', description: 'Array of journal lines' },
            { name: 'totalDebit', type: 'number', description: 'Sum of all debits' },
            { name: 'totalCredit', type: 'number', description: 'Sum of all credits' },
          ]}
        />

        <DataStructure
          title="Accounts Payable"
          description="Tracks vendor invoices and payment obligations"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'invoiceNumber', type: 'string', description: 'Vendor invoice number' },
            { name: 'vendorId', type: 'string', description: 'Reference to vendor' },
            { name: 'invoiceDate', type: 'Date', description: 'Invoice date' },
            { name: 'dueDate', type: 'Date', description: 'Payment due date' },
            { name: 'amount', type: 'number', description: 'Total invoice amount' },
            { name: 'amountPaid', type: 'number', description: 'Amount paid so far' },
            { name: 'amountDue', type: 'number', description: 'Remaining amount' },
            { name: 'status', type: 'enum', description: 'Open | Partial | Paid | Overdue' },
          ]}
        />

        <DataStructure
          title="Budget"
          description="Defines budget allocations and tracks spending against budgets"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'budgetName', type: 'string', description: 'Budget name' },
            { name: 'fiscalYear', type: 'string', description: 'Fiscal year' },
            { name: 'department', type: 'string', description: 'Department code' },
            { name: 'accountId', type: 'string', description: 'GL account reference' },
            { name: 'periodType', type: 'enum', description: 'Monthly | Quarterly | Annually' },
            { name: 'allocatedAmount', type: 'number', description: 'Budgeted amount' },
            { name: 'spentAmount', type: 'number', description: 'Actual spending' },
            { name: 'remainingAmount', type: 'number', description: 'Budget remaining' },
          ]}
        />
      </div>
    </div>
  );
}
