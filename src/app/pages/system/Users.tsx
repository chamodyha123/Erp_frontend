import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users as UsersIcon,
} from 'lucide-react';

import userService, {
  type User,
} from '@/services/userService';

import employeeService, {
  type Employee,
} from '@/services/employeeService';

import {
  DetailRow,
  FormField,
  inputCls,
  Modal,
  ModalBtn,
  selectCls,
} from '@/app/components/ui/Modal';

type UserForm = {
  username: string;
  email: string;
  password: string;
  role: string;
  enabled: boolean;
  employeeId: string;
};

const roleOptions = [
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

const blankForm = (): UserForm => ({
  username: '',
  email: '',
  password: '',
  role: 'EMPLOYEE',
  enabled: true,
  employeeId: '',
});

const formatDate = (
  value?: string | null,
): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const responseError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    if (responseError.response?.data?.message) {
      return responseError.response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export function Users() {
  const [records, setRecords] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const [modal, setModal] = useState<
    'view' | 'new' | 'edit' | 'delete' | null
  >(null);

  const [selected, setSelected] = useState<User | null>(
    null,
  );

  const [form, setForm] = useState<UserForm>(
    blankForm(),
  );

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const users = await userService.getAll();

      setRecords(Array.isArray(users) ? users : []);
    } catch (error: unknown) {
      console.error('Failed to load users:', error);

      setRecords([]);

      setError(
        getErrorMessage(
          error,
          'Failed to load users. Check the backend connection and your account permissions.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    setEmployeesLoading(true);

    try {
      const response = await employeeService.getAll({
        page: 0,
        size: 1000,
      });

      setEmployees(
        Array.isArray(response.content)
          ? response.content
          : [],
      );
    } catch (error: unknown) {
      console.error('Failed to load employees:', error);
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    void loadEmployees();
  }, []);

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return records.filter((record) => {
      const username =
        record.username?.toLowerCase() ?? '';

      const email =
        record.email?.toLowerCase() ?? '';

      const role =
        record.role?.toLowerCase() ??
        record.roles?.join(' ').toLowerCase() ??
        '';

      const employeeName =
        record.employeeName?.toLowerCase() ?? '';

      const matchesSearch =
        !keyword ||
        username.includes(keyword) ||
        email.includes(keyword) ||
        role.includes(keyword) ||
        employeeName.includes(keyword);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' &&
          record.enabled) ||
        (statusFilter === 'inactive' &&
          !record.enabled);

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const closeModal = () => {
    if (saving || deleting) {
      return;
    }

    setModal(null);
    setSelected(null);
    setForm(blankForm());
    setFormError('');
  };

  const openView = (user: User) => {
    setSelected(user);
    setFormError('');
    setModal('view');
  };

  const openNew = () => {
    setSelected(null);
    setForm(blankForm());
    setFormError('');
    setModal('new');
  };

  const openEdit = (user: User) => {
    setSelected(user);

    setForm({
      username: user.username ?? '',
      email: user.email ?? '',
      password: '',
      role:
        user.role ??
        user.roles?.[0] ??
        'EMPLOYEE',
      enabled: user.enabled ?? false,
      employeeId:
        user.employeeId !== null &&
        user.employeeId !== undefined
          ? String(user.employeeId)
          : '',
    });

    setFormError('');
    setModal('edit');
  };

  const openDelete = (user: User) => {
    setSelected(user);
    setFormError('');
    setModal('delete');
  };

  const validateForm = (
    isEditing: boolean,
  ): string | null => {
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!username) {
      return 'Username is required.';
    }

    if (username.length < 3) {
      return 'Username must contain at least 3 characters.';
    }

    if (!email) {
      return 'Email is required.';
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return 'Enter a valid email address.';
    }

    if (!isEditing && !password) {
      return 'Password is required.';
    }

    if (password && password.length < 6) {
      return 'Password must contain at least 6 characters.';
    }

    if (!form.role) {
      return 'Role is required.';
    }

    return null;
  };

  const handleCreate = async () => {
    setFormError('');

    const validationError = validateForm(false);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSaving(true);

    try {
      await userService.create({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        role: form.role,
        enabled: form.enabled,
        employeeId: form.employeeId
          ? Number(form.employeeId)
          : null,
      });

      await loadUsers();

      setModal(null);
      setSelected(null);
      setForm(blankForm());
      setFormError('');
    } catch (error: unknown) {
      setFormError(
        getErrorMessage(
          error,
          'Failed to create user.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selected) {
      return;
    }

    setFormError('');

    const validationError = validateForm(true);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSaving(true);

    try {
      await userService.update(selected.id, {
        email: form.email.trim().toLowerCase(),
        role: form.role,
        enabled: form.enabled,
        employeeId: form.employeeId
          ? Number(form.employeeId)
          : null,
      });

      if (form.password.trim()) {
        await userService.changePassword(
          selected.id,
          form.password.trim(),
        );
      }

      await loadUsers();

      setModal(null);
      setSelected(null);
      setForm(blankForm());
      setFormError('');
    } catch (error: unknown) {
      setFormError(
        getErrorMessage(
          error,
          'Failed to update user.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) {
      return;
    }

    setFormError('');
    setDeleting(true);

    try {
      await userService.delete(selected.id);

      await loadUsers();

      setModal(null);
      setSelected(null);
      setForm(blankForm());
      setFormError('');
    } catch (error: unknown) {
      setFormError(
        getErrorMessage(
          error,
          'Failed to delete user.',
        ),
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            Users
          </h1>

          <p className="mt-1 text-gray-500">
            Manage system user accounts and roles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void loadUsers();
              void loadEmployees();
            }}
            disabled={loading || employeesLoading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-5 w-5 ${
                loading || employeesLoading
                  ? 'animate-spin'
                  : ''
              }`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            New User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => void loadUsers()}
            className="whitespace-nowrap font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by username, email, role or employee..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="relative min-w-48">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | 'all'
                    | 'active'
                    | 'inactive',
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="inactive">
                Inactive only
              </option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredRecords.length} of{' '}
          {records.length} users
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-8 text-gray-500">
            <RefreshCw className="h-7 w-7 animate-spin text-blue-600" />
            <span>Loading users...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-8 text-center">
            <UsersIcon className="h-10 w-10 text-gray-300" />

            <p className="font-medium text-gray-600">
              No users found
            </p>

            <p className="text-sm text-gray-400">
              {records.length === 0
                ? 'There are no user records available.'
                : 'Try changing your search or status filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    'Username',
                    'Email',
                    'Role',
                    'Employee',
                    'Status',
                    'Created At',
                    'Actions',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {record.username || '-'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.email || '-'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {record.role ||
                          record.roles?.[0] ||
                          '-'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.employeeName || '-'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          record.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {record.enabled
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(record.createdAt)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openView(record)}
                          className="font-medium text-blue-600 transition hover:text-blue-800"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(record)}
                          className="inline-flex items-center justify-center text-amber-500 transition hover:text-amber-700"
                          aria-label={`Edit ${record.username}`}
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openDelete(record)
                          }
                          className="inline-flex items-center justify-center text-red-600 transition hover:text-red-800"
                          aria-label={`Delete ${record.username}`}
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modal === 'view'}
        onClose={closeModal}
        title="User Details"
        size="md"
        footer={
          <ModalBtn onClick={closeModal}>
            Close
          </ModalBtn>
        }
      >
        {selected && (
          <div>
            <DetailRow
              label="User ID"
              value={selected.id}
            />

            <DetailRow
              label="Username"
              value={selected.username || '-'}
            />

            <DetailRow
              label="Email"
              value={selected.email || '-'}
            />

            <DetailRow
              label="Role"
              value={
                selected.role ||
                selected.roles?.join(', ') ||
                '-'
              }
            />

            <DetailRow
              label="Employee"
              value={selected.employeeName || '-'}
            />

            <DetailRow
              label="Employee ID"
              value={selected.employeeId ?? '-'}
            />

            <DetailRow
              label="Status"
              value={
                selected.enabled
                  ? 'Active'
                  : 'Inactive'
              }
            />

            <DetailRow
              label="Last Login"
              value={formatDate(selected.lastLogin)}
            />

            <DetailRow
              label="Created At"
              value={formatDate(selected.createdAt)}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={modal === 'new'}
        onClose={closeModal}
        title="New User"
        size="md"
        footer={
          <>
            <ModalBtn
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </ModalBtn>

            <ModalBtn
              variant="primary"
              onClick={() => void handleCreate()}
              disabled={saving}
            >
              {saving
                ? 'Creating...'
                : 'Create User'}
            </ModalBtn>
          </>
        }
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="space-y-4">
          <FormField label="Username" required>
            <input
              type="text"
              value={form.username}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
              placeholder="Enter username"
              className={inputCls}
              disabled={saving}
              autoComplete="username"
            />
          </FormField>

          <FormField label="Email" required>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="Enter email address"
              className={inputCls}
              disabled={saving}
              autoComplete="email"
            />
          </FormField>


          <FormField label="Employee">
            <select
              value={form.employeeId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  employeeId: event.target.value,
                }))
              }
              className={selectCls}
              disabled={saving || employeesLoading}
            >
              <option value="">
                {employeesLoading
                  ? 'Loading employees...'
                  : 'Select employee'}
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.employeeId
                    ? `${employee.employeeId} - ${employee.fullName}`
                    : employee.fullName}
                </option>
              ))}
            </select>

            {!employeesLoading &&
              employees.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No employees are available.
                </p>
              )}
          </FormField>

          <FormField label="Password" required>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Minimum 6 characters"
              className={inputCls}
              disabled={saving}
              autoComplete="new-password"
            />
          </FormField>

          <FormField label="Role" required>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
              className={selectCls}
              disabled={saving}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Status">
            <select
              value={
                form.enabled
                  ? 'active'
                  : 'inactive'
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  enabled:
                    event.target.value ===
                    'active',
                }))
              }
              className={selectCls}
              disabled={saving}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </FormField>
        </div>
      </Modal>

      <Modal
        open={modal === 'edit'}
        onClose={closeModal}
        title="Edit User"
        size="md"
        footer={
          <>
            <ModalBtn
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </ModalBtn>

            <ModalBtn
              variant="primary"
              onClick={() => void handleEdit()}
              disabled={saving}
            >
              {saving
                ? 'Updating...'
                : 'Update User'}
            </ModalBtn>
          </>
        }
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="space-y-4">
          <FormField label="Username">
            <input
              type="text"
              value={form.username}
              className={`${inputCls} cursor-not-allowed bg-gray-100`}
              disabled
            />
          </FormField>

          <FormField label="Email" required>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="Enter email address"
              className={inputCls}
              disabled={saving}
              autoComplete="email"
            />
          </FormField>


          <FormField label="Employee">
            <select
              value={form.employeeId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  employeeId: event.target.value,
                }))
              }
              className={selectCls}
              disabled={saving || employeesLoading}
            >
              <option value="">
                {employeesLoading
                  ? 'Loading employees...'
                  : 'No employee selected'}
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.employeeId
                    ? `${employee.employeeId} - ${employee.fullName}`
                    : employee.fullName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="New Password">
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Leave blank to keep current password"
              className={inputCls}
              disabled={saving}
              autoComplete="new-password"
            />
          </FormField>

          <FormField label="Role" required>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
              className={selectCls}
              disabled={saving}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Status">
            <select
              value={
                form.enabled
                  ? 'active'
                  : 'inactive'
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  enabled:
                    event.target.value ===
                    'active',
                }))
              }
              className={selectCls}
              disabled={saving}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </FormField>
        </div>
      </Modal>

      <Modal
        open={modal === 'delete'}
        onClose={closeModal}
        title="Delete User"
        size="sm"
        footer={
          <>
            <ModalBtn
              onClick={closeModal}
              disabled={deleting}
            >
              Cancel
            </ModalBtn>

            <ModalBtn
              variant="danger"
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              {deleting
                ? 'Deleting...'
                : 'Delete'}
            </ModalBtn>
          </>
        }
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <p className="text-gray-600">
          Are you sure you want to delete user{' '}
          <strong>{selected?.username}</strong>?
        </p>

        <p className="mt-2 text-sm text-red-600">
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}