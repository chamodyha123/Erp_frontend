interface Field {
  name: string;
  type: string;
  description?: string;
}

interface DataStructureProps {
  title: string;
  description: string;
  fields: Field[];
}

export function DataStructure({ title, description, fields }: DataStructureProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-900 border-b">Field Name</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-b">Type</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 font-mono text-blue-600 border-b">{field.name}</td>
                <td className="p-3 font-mono text-gray-700 border-b">{field.type}</td>
                <td className="p-3 text-gray-600 border-b">{field.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start gap-4">
      {icon && (
        <div className="p-3 bg-blue-500 text-white rounded-lg">
          {icon}
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}
