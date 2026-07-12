import { Settings } from 'lucide-react';

import {
  DataStructure,
  PageHeader,
} from '../../components/DataStructure';

export function SystemOverview() {
  return (
    <div className="p-6">
      <PageHeader
        title="Core System Module"
        description="Core system functions including user management, roles, permissions, audit logs, and application settings"
        icon={<Settings className="h-8 w-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="User"
          description="System users and authentication information"
          fields={[
            {
              name: 'id',
              type: 'string',
              description: 'Unique identifier',
            },
            {
              name: 'username',
              type: 'string',
              description: 'Username',
            },
            {
              name: 'email',
              type: 'string',
              description: 'Email address',
            },
            {
              name: 'firstName',
              type: 'string',
              description: 'First name',
            },
            {
              name: 'lastName',
              type: 'string',
              description: 'Last name',
            },
            {
              name: 'roleId',
              type: 'string',
              description: 'Role reference',
            },
            {
              name: 'department',
              type: 'string',
              description: 'Department',
            },
            {
              name: 'isActive',
              type: 'boolean',
              description: 'Active status',
            },
            {
              name: 'lastLogin',
              type: 'Date',
              description: 'Last login timestamp',
            },
          ]}
        />

        <DataStructure
          title="Role"
          description="User roles and permission groups"
          fields={[
            {
              name: 'id',
              type: 'string',
              description: 'Unique identifier',
            },
            {
              name: 'name',
              type: 'string',
              description: 'Role name',
            },
            {
              name: 'description',
              type: 'string',
              description: 'Role description',
            },
            {
              name: 'permissions',
              type: 'Permission[]',
              description: 'List of permissions',
            },
            {
              name: 'createdAt',
              type: 'Date',
              description: 'Creation date',
            },
          ]}
        />

        <DataStructure
          title="Permission"
          description="Detailed access control permissions"
          fields={[
            {
              name: 'id',
              type: 'string',
              description: 'Unique identifier',
            },
            {
              name: 'module',
              type: 'string',
              description: 'Module name',
            },
            {
              name: 'resource',
              type: 'string',
              description: 'Resource name',
            },
            {
              name: 'actions',
              type: 'string[]',
              description:
                'Allowed actions: create, read, update, and delete',
            },
          ]}
        />

        <DataStructure
          title="Audit Log"
          description="System activity and audit history"
          fields={[
            {
              name: 'id',
              type: 'string',
              description: 'Unique identifier',
            },
            {
              name: 'userId',
              type: 'string',
              description:
                'User who performed the action',
            },
            {
              name: 'action',
              type: 'string',
              description: 'Action performed',
            },
            {
              name: 'entity',
              type: 'string',
              description: 'Affected entity',
            },
            {
              name: 'entityId',
              type: 'string',
              description: 'Affected entity ID',
            },
            {
              name: 'oldValues',
              type: 'object',
              description:
                'Values before the change',
            },
            {
              name: 'newValues',
              type: 'object',
              description:
                'Values after the change',
            },
            {
              name: 'ipAddress',
              type: 'string',
              description: 'IP address',
            },
            {
              name: 'timestamp',
              type: 'Date',
              description:
                'Date and time of the activity',
            },
          ]}
        />

        <DataStructure
          title="System Setting"
          description="Application configuration and settings"
          fields={[
            {
              name: 'id',
              type: 'string',
              description: 'Unique identifier',
            },
            {
              name: 'category',
              type: 'string',
              description: 'Setting category',
            },
            {
              name: 'key',
              type: 'string',
              description: 'Setting key',
            },
            {
              name: 'value',
              type: 'string',
              description: 'Setting value',
            },
            {
              name: 'dataType',
              type: 'enum',
              description:
                'string | number | boolean | json',
            },
            {
              name: 'description',
              type: 'string',
              description: 'Setting description',
            },
            {
              name: 'updatedBy',
              type: 'string',
              description:
                'User who last updated the setting',
            },
            {
              name: 'updatedAt',
              type: 'Date',
              description:
                'Last updated date and time',
            },
          ]}
        />
      </div>
    </div>
  );
}