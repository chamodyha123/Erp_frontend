import { Settings } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function SystemOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Core System Module" 
        description="Foundation system including user management, roles, permissions, audit logs, and settings"
        icon={<Settings className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="User"
          description="System users and authentication"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'username', type: 'string', description: 'Username' },
            { name: 'email', type: 'string', description: 'Email address' },
            { name: 'firstName', type: 'string', description: 'First name' },
            { name: 'lastName', type: 'string', description: 'Last name' },
            { name: 'roleId', type: 'string', description: 'Role reference' },
            { name: 'department', type: 'string', description: 'Department' },
            { name: 'isActive', type: 'boolean', description: 'Active status' },
            { name: 'lastLogin', type: 'Date', description: 'Last login timestamp' },
          ]}
        />

        <DataStructure
          title="Role"
          description="User roles and permission groups"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'name', type: 'string', description: 'Role name' },
            { name: 'description', type: 'string', description: 'Role description' },
            { name: 'permissions', type: 'Permission[]', description: 'List of permissions' },
            { name: 'createdAt', type: 'Date', description: 'Creation date' },
          ]}
        />

        <DataStructure
          title="Permission"
          description="Granular access control permissions"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'module', type: 'string', description: 'Module name' },
            { name: 'resource', type: 'string', description: 'Resource name' },
            { name: 'actions', type: 'string[]', description: 'Allowed actions: create, read, update, delete' },
          ]}
        />

        <DataStructure
          title="Audit Log"
          description="System activity audit trail"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'userId', type: 'string', description: 'User who performed action' },
            { name: 'action', type: 'string', description: 'Action performed' },
            { name: 'module', type: 'string', description: 'Module affected' },
            { name: 'resource', type: 'string', description: 'Resource affected' },
            { name: 'resourceId', type: 'string', description: 'Resource ID' },
            { name: 'changes', type: 'object', description: 'Change details' },
            { name: 'ipAddress', type: 'string', description: 'IP address' },
            { name: 'timestamp', type: 'Date', description: 'Timestamp' },
          ]}
        />

        <DataStructure
          title="System Settings"
          description="Application configuration and settings"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'category', type: 'string', description: 'Setting category' },
            { name: 'key', type: 'string', description: 'Setting key' },
            { name: 'value', type: 'string', description: 'Setting value' },
            { name: 'dataType', type: 'enum', description: 'string | number | boolean | json' },
            { name: 'description', type: 'string', description: 'Setting description' },
            { name: 'updatedBy', type: 'string', description: 'Last updated by' },
            { name: 'updatedAt', type: 'Date', description: 'Last updated timestamp' },
          ]}
        />
      </div>
    </div>
  );
}
