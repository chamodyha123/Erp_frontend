import { ShoppingCart } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function SalesOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Sales Module" 
        description="Comprehensive sales management from quotations to invoices and customer relationships"
        icon={<ShoppingCart className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Customer"
          description="Customer master data and relationship information"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'customerCode', type: 'string', description: 'Customer code' },
            { name: 'companyName', type: 'string', description: 'Company name' },
            { name: 'contactPerson', type: 'string', description: 'Primary contact' },
            { name: 'email', type: 'string', description: 'Email address' },
            { name: 'phone', type: 'string', description: 'Phone number' },
            { name: 'creditLimit', type: 'number', description: 'Credit limit' },
            { name: 'paymentTerms', type: 'string', description: 'Payment terms' },
          ]}
        />

        <DataStructure
          title="Sales Quotation"
          description="Sales quotations and proposals to customers"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'quotationNumber', type: 'string', description: 'Sequential number' },
            { name: 'customerId', type: 'string', description: 'Customer reference' },
            { name: 'date', type: 'Date', description: 'Quotation date' },
            { name: 'validUntil', type: 'Date', description: 'Validity date' },
            { name: 'status', type: 'enum', description: 'Draft | Sent | Accepted | Rejected | Expired' },
            { name: 'totalAmount', type: 'number', description: 'Total quotation amount' },
          ]}
        />

        <DataStructure
          title="Sales Order"
          description="Confirmed customer orders ready for fulfillment"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'orderNumber', type: 'string', description: 'Sequential number' },
            { name: 'customerId', type: 'string', description: 'Customer reference' },
            { name: 'orderDate', type: 'Date', description: 'Order date' },
            { name: 'deliveryDate', type: 'Date', description: 'Expected delivery' },
            { name: 'status', type: 'enum', description: 'Pending | Confirmed | Shipped | Delivered' },
            { name: 'totalAmount', type: 'number', description: 'Total order amount' },
          ]}
        />

        <DataStructure
          title="Sales Invoice"
          description="Customer invoices for goods and services sold"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'invoiceNumber', type: 'string', description: 'Sequential number' },
            { name: 'customerId', type: 'string', description: 'Customer reference' },
            { name: 'invoiceDate', type: 'Date', description: 'Invoice date' },
            { name: 'dueDate', type: 'Date', description: 'Payment due date' },
            { name: 'status', type: 'enum', description: 'Draft | Sent | Partial | Paid | Overdue' },
            { name: 'totalAmount', type: 'number', description: 'Total invoice amount' },
          ]}
        />
      </div>
    </div>
  );
}
