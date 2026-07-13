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
  // Color-coded type badges
  const getTypeColor = (type: string) => {
    if (type.includes('string') || type.includes('String')) return 'bg-emerald-100 text-emerald-700';
    if (type.includes('number') || type.includes('Number')) return 'bg-blue-100 text-blue-700';
    if (type.includes('Date')) return 'bg-purple-100 text-purple-700';
    if (type.includes('enum') || type.includes('Enum')) return 'bg-amber-100 text-amber-700';
    if (type.includes('boolean') || type.includes('Boolean')) return 'bg-rose-100 text-rose-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="flex-shrink-0 w-1 h-10 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
              <th className="text-left p-3.5 font-semibold text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
                Field Name
              </th>
              <th className="text-left p-3.5 font-semibold text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
                Type
              </th>
              <th className="text-left p-3.5 font-semibold text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr 
                key={index} 
                className={`transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white hover:bg-blue-50/30' : 'bg-gray-50/50 hover:bg-blue-50/30'
                }`}
              >
                <td className="p-3.5 border-b border-gray-100">
                  <code className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {field.name}
                  </code>
                </td>
                <td className="p-3.5 border-b border-gray-100">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(field.type)}`}>
                    {field.type}
                  </span>
                </td>
                <td className="p-3.5 border-b border-gray-100 text-gray-600 text-xs leading-relaxed">
                  {field.description || <span className="text-gray-300 italic">—</span>}
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400 text-sm">
                  No fields defined
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <div className="w-6 h-6 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-500 mt-1.5 text-sm leading-relaxed max-w-2xl">{description}</p>
        </div>
      </div>
      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}