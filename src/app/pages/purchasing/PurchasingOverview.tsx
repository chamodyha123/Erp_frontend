import { Package } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function PurchasingOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Purchasing Module" 
        description="Complete procurement management from requisitions to purchase orders and vendor management"
        icon={<Package className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Vendor"
          description="Vendor master data and supplier relationships"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'vendorCode', type: 'string', description: 'Vendor code' },
            { name: 'companyName', type: 'string', description: 'Company name' },
            { name: 'contactPerson', type: 'string', description: 'Primary contact' },
            { name: 'email', type: 'string', description: 'Email address' },
            { name: 'phone', type: 'string', description: 'Phone number' },
            { name: 'paymentTerms', type: 'string', description: 'Payment terms' },
          ]}
        />

        <DataStructure
          title="Purchase Requisition"
          description="Internal requests for goods or services purchase"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'requisitionNumber', type: 'string', description: 'Sequential number' },
            { name: 'requestedBy', type: 'string', description: 'Requester user ID' },
            { name: 'department', type: 'string', description: 'Requesting department' },
            { name: 'dateRequested', type: 'Date', description: 'Request date' },
            { name: 'dateRequired', type: 'Date', description: 'Required by date' },
            { name: 'status', type: 'enum', description: 'Draft | Pending | Approved | Rejected' },
          ]}
        />

        <DataStructure
          title="Purchase Order"
          description="Formal purchase orders sent to vendors"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'poNumber', type: 'string', description: 'PO number' },
            { name: 'vendorId', type: 'string', description: 'Vendor reference' },
            { name: 'orderDate', type: 'Date', description: 'Order date' },
            { name: 'expectedDelivery', type: 'Date', description: 'Expected delivery date' },
            { name: 'status', type: 'enum', description: 'Draft | Sent | Acknowledged | Received' },
          ]}
        />
      </div>
    </div>
  );
}
