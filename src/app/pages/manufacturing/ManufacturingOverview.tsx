import { Factory } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function ManufacturingOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Manufacturing Module" 
        description="Production planning and control including BOMs, work orders, and quality management"
        icon={<Factory className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Bill of Materials (BOM)"
          description="Product structure and component requirements"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'bomNumber', type: 'string', description: 'BOM number' },
            { name: 'productId', type: 'string', description: 'Finished product' },
            { name: 'version', type: 'number', description: 'Version number' },
            { name: 'effectiveDate', type: 'Date', description: 'Effective from date' },
            { name: 'components', type: 'BOMComponent[]', description: 'List of components' },
          ]}
        />

        <DataStructure
          title="Work Order"
          description="Shop floor work instructions and job tracking"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'workOrderNumber', type: 'string', description: 'Work order number' },
            { name: 'productionOrderId', type: 'string', description: 'Parent production order' },
            { name: 'operation', type: 'string', description: 'Operation description' },
            { name: 'workCenter', type: 'string', description: 'Work center' },
            { name: 'status', type: 'enum', description: 'Pending | In Progress | Completed' },
          ]}
        />

        <DataStructure
          title="Production Order"
          description="Master production schedule and order management"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'productionOrderNumber', type: 'string', description: 'PO number' },
            { name: 'productId', type: 'string', description: 'Product to manufacture' },
            { name: 'plannedQuantity', type: 'number', description: 'Quantity to produce' },
            { name: 'plannedStartDate', type: 'Date', description: 'Planned start' },
            { name: 'plannedEndDate', type: 'Date', description: 'Planned completion' },
          ]}
        />
      </div>
    </div>
  );
}
