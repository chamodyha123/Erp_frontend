import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Plus,
  Search,
  Trash2,
  Users as UsersIcon,
} from 'lucide-react';

import userService, {
  type CreateUserRequest,
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

const blankForm = (): CreateUserRequest => ({
  username: '',
  email: '',
  password: '',
  employeeId: undefined,
  roles: ['EMPLOYEE'],
});

export function Users() {
  const [records, setRecords] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const [search, setSearch] = useState('');

  const [modal, setModal] = useState<
    'view' | 'new' | 'delete' | null
  >(null);

  const [selected, setSelected] = useState<User | null>(null);

  const [form, setForm] = useState<CreateUserRequest>(
    blankForm(),
  );

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const users = await userService.getAll();
      setRecords(users);
    } catch (err: any) {
      setRecords([]);

      setError(
        err?.response?.data?.message ||
          'Failed to load users. Check whether the backend is running.',
      );
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    setEmployeesLoading(true);
    setFormError('');

    try {
      const response = await employeeService.getAll({
        page: 0,
        size: 1000,
      });

      setEmployees(response.content ?? []);
    } catch (err: any) {
      setEmployees([]);

      setFormError(
        err?.response?.data?.message ||
          'Failed to load employees.',
      );
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return records;
    }

    return records.filter((record) => {
      const username = record.username?.toLowerCase() ?? '';
      const email = record.email?.toLowerCase() ?? '';
      const roles = record.roles?.join(' ').toLowerCase() ?? '';
      const employeeName =
        record.employeeName?.toLowerCase() ?? '';

      return (
        username.includes(keyword) ||
        email.includes(keyword) ||
        roles.includes(keyword) ||
        employeeName.includes(keyword)
      );
    });
  }, [records, search]);

  const closeModal = () => {
    if (saving || deleting) {
      return;
    }

    setModal(null);
    setSelected(null);
    setForm(blankForm());
    setFormError('');
  };

  const openNewUserModal = async () => {
    setForm(blankForm());
    setSelected(null);
    setFormError('');
    setModal('new');

    await loadEmployees();
  };

  const validateForm = (): string | null => {
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

    if (!password) {
      return 'Password is required.';
    }

    if (password.length < 6) {
      return 'Password must contain at least 6 characters.';
    }

    if (!form.roles || form.roles.length === 0) {
      return 'A role is required.';
    }

    return null;
  };

  const handleNew = async () => {
    setFormError('');

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSaving(true);

    try {
      const request: CreateUserRequest = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        roles: form.roles,
      };

      /*
       * Only include employeeId when the user has selected
       * an actual employee from the dropdown.
       *
       * The selected value is the employee database primary key,
       * not the visible employee code such as EMP101.
       */
      if (
        form.employeeId !== undefined &&
        form.employeeId !== null &&
        form.employeeId > 0
      ) {
        request.employeeId = form.employeeId;
      }

      await userService.create(request);
      await loadUsers();

      setModal(null);
      setSelected(null);
      setForm(blankForm());
      setFormError('');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create user.';

      setFormError(message);
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
      setFormError('');
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          'Failed to delete user.',
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            Users
          </h1>

          <p className="mt-1 text-gray-500">
            Manage system user accounts
          </p>
        </div>

        <button
          type="button"
          onClick={() => void openNewUserModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          New User
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading users...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    'Username',
                    'Email',
                    'Employee',
                    'Roles',
                    'Status',
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
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {record.username}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.email}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.employeeName || '-'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.roles?.join(', ') || '-'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {record.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(record);
                            setFormError('');
                            setModal('view');
                          }}
                          className="font-medium text-blue-600 transition hover:text-blue-800"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelected(record);
                            setFormError('');
                            setModal('delete');
                          }}
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
              label="Username"
              value={selected.username}
            />

            <DetailRow
              label="Email"
              value={selected.email}
            />

            <DetailRow
              label="Roles"
              value={selected.roles?.join(', ') || '-'}
            />

            <DetailRow
              label="Employee"
              value={selected.employeeName || '-'}
            />

            <DetailRow
              label="Status"
              value={
                selected.isActive
                  ? 'Active'
                  : 'Inactive'
              }
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
              onClick={() => void handleNew()}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </ModalBtn>
          </>
        }
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            />
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
            />
          </FormField>

          <FormField label="Role" required>
            <select
              value={form.roles[0] ?? 'EMPLOYEE'}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  roles: [event.target.value],
                }))
              }
              className={selectCls}
              disabled={saving}
            >
              {roleOptions.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Employee">
              <select
                value={form.employeeId ?? ''}
                onChange={(event) => {
                  const value = event.target.value;

                  setForm((current) => ({
                    ...current,
                    employeeId:
                      value === ''
                        ? undefined
                        : Number(value),
                  }));
                }}
                className={selectCls}
                disabled={employeesLoading || saving}
              >
                <option value="">
                  No linked employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.employeeId} -{' '}
                    {employee.fullName}
                    {employee.position
                      ? ` (${employee.position})`
                      : ''}
                  </option>
                ))}
              </select>

              {employeesLoading && (
                <p className="mt-1 text-xs text-gray-500">
                  Loading employees...
                </p>
              )}

              {!employeesLoading &&
                employees.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No employees are available. You can
                    create the user without linking an
                    employee.
                  </p>
                )}

              <p className="mt-1 text-xs text-gray-500">
                Select an employee from the list. Do not
                manually enter an employee code.
              </p>
            </FormField>
          </div>
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
              {deleting ? 'Deleting...' : 'Delete'}
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
      </Modal>
    </div>
  );
}