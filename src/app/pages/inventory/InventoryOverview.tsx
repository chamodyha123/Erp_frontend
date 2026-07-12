import { Package } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function InventoryOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Inventory Module" 
        description="Complete inventory management including products, warehouses, stock levels, and movements"
        icon={<Package className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Product"
          description="Product master data and specifications"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'sku', type: 'string', description: 'Stock keeping unit' },
            { name: 'productName', type: 'string', description: 'Product name' },
            { name: 'category', type: 'string', description: 'Product category' },
            { name: 'unitOfMeasure', type: 'string', description: 'Unit of measure' },
            { name: 'standardCost', type: 'number', description: 'Standard cost' },
            { name: 'sellingPrice', type: 'number', description: 'Selling price' },
          ]}
        />

        <DataStructure
          title="Warehouse"
          description="Warehouse locations and storage facilities"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'warehouseCode', type: 'string', description: 'Warehouse code' },
            { name: 'warehouseName', type: 'string', description: 'Warehouse name' },
            { name: 'location', type: 'string', description: 'Physical location' },
            { name: 'capacity', type: 'number', description: 'Total capacity' },
          ]}
        />

        <DataStructure
          title="Stock Level"
          description="Current stock quantities per product and warehouse"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'productId', type: 'string', description: 'Product reference' },
            { name: 'warehouseId', type: 'string', description: 'Warehouse reference' },
            { name: 'quantityOnHand', type: 'number', description: 'Available quantity' },
            { name: 'quantityReserved', type: 'number', description: 'Reserved quantity' },
            { name: 'reorderPoint', type: 'number', description: 'Reorder trigger level' },
          ]}
        />
      </div>
    </div>
  );
}
