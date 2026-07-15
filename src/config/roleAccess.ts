export type AppRole =
  | 'SUPER_ADMIN'
  | 'FINANCE_MANAGER'
  | 'HR_MANAGER'
  | 'SALES_MANAGER'
  | 'PURCHASING_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'MANUFACTURING_MANAGER'
  | 'PROJECT_MANAGER'
  | 'EMPLOYEE'
  | 'VIEWER';

export const allRoles: AppRole[] = [
  'SUPER_ADMIN',
  'FINANCE_MANAGER',
  'HR_MANAGER',
  'SALES_MANAGER',
  'PURCHASING_MANAGER',
  'INVENTORY_MANAGER',
  'MANUFACTURING_MANAGER',
  'PROJECT_MANAGER',
  'EMPLOYEE',
  'VIEWER',
];

export const moduleRoles = {
  dashboard: allRoles,

  finance: [
    'SUPER_ADMIN',
    'FINANCE_MANAGER',
  ],

  sales: [
    'SUPER_ADMIN',
    'SALES_MANAGER',
  ],

  purchasing: [
    'SUPER_ADMIN',
    'PURCHASING_MANAGER',
  ],

  inventory: [
    'SUPER_ADMIN',
    'INVENTORY_MANAGER',
  ],

  manufacturing: [
    'SUPER_ADMIN',
    'MANUFACTURING_MANAGER',
  ],

  hr: [
    'SUPER_ADMIN',
    'HR_MANAGER',
  ],

  crm: [
    'SUPER_ADMIN',
    'SALES_MANAGER',
  ],

  projects: [
    'SUPER_ADMIN',
    'PROJECT_MANAGER',
  ],

  assets: [
    'SUPER_ADMIN',
    'PROJECT_MANAGER',
  ],

  employeeSelfService: [
    'SUPER_ADMIN',
    'HR_MANAGER',
    'EMPLOYEE',
  ],

  systemOverview: [
    'SUPER_ADMIN',
  ],

  systemUsers: [
    'SUPER_ADMIN',
  ],

  systemRoles: [
    'SUPER_ADMIN',
  ],

  systemAuditLogs: [
    'SUPER_ADMIN',
  ],

  systemSettings: [
    'SUPER_ADMIN',
  ],
} satisfies Record<string, AppRole[]>;

export function normalizeRole(role: string): string {
  return role
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, '')
    .replace(/\s+/g, '_');
}

export function hasAllowedRole(
  userRoles: string[] | undefined,
  allowedRoles: AppRole[],
): boolean {
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  const normalizedUserRoles =
    userRoles.map(normalizeRole);

  return normalizedUserRoles.some((role) =>
    allowedRoles.includes(role as AppRole),
  );
}