import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users as UsersIcon,
} from 'lucide-react';

import userService, {
  type User,
} from '@/services/userService';

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
});

export function Users() {
  const [records, setRecords] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState<
    'view' | 'new' | 'edit' | 'delete' | null
  >(null);

  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(blankForm());

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await userService.getAll({
        page: 0,
        size: 1000,
      });

      setRecords(response.content ?? []);
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
      const role = record.role?.toLowerCase() ?? '';
      const status = record.enabled ? 'active' : 'inactive';

      return (
        username.includes(keyword) ||
        email.includes(keyword) ||
        role.includes(keyword) ||
        status.includes(keyword)
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
      role: user.role ?? 'EMPLOYEE',
      enabled: user.enabled,
    });
    setFormError('');
    setModal('edit');
  };

  const validateForm = (isEditing: boolean): string | null => {
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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        password: form.password,
        role: form.role,
        enabled: form.enabled,
      });

      await loadUsers();
      closeModal();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to create user.',
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
      const request: Partial<User> & { password?: string } = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        enabled: form.enabled,
      };

      if (form.password.trim()) {
        request.password = form.password;
      }

      await userService.update(selected.id, request);
      await loadUsers();
      closeModal();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update user.',
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
      closeModal();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
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
          onClick={openNew}
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
              onChange={(event) => setSearch(event.target.value)}
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
                    'Role',
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
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {record.username}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.email || '-'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.role || '-'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          record.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {record.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.createdAt || '-'}
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
                          onClick={() => openEdit(record)}
                          className="inline-flex items-center justify-center text-amber-500 transition hover:text-amber-700"
                          aria-label={`Edit ${record.username}`}
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
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
        footer={<ModalBtn onClick={closeModal}>Close</ModalBtn>}
      >
        {selected && (
          <div>
            <DetailRow label="Username" value={selected.username} />
            <DetailRow label="Email" value={selected.email || '-'} />
            <DetailRow label="Role" value={selected.role || '-'} />
            <DetailRow
              label="Status"
              value={selected.enabled ? 'Active' : 'Inactive'}
            />
            <DetailRow
              label="Created At"
              value={selected.createdAt || '-'}
            />
          </div>
        )}
      </Modal>

      {(['new', 'edit'] as const).map((mode) => (
        <Modal
          key={mode}
          open={modal === mode}
          onClose={closeModal}
          title={mode === 'new' ? 'New User' : 'Edit User'}
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
                onClick={() =>
                  void (mode === 'new'
                    ? handleCreate()
                    : handleEdit())
                }
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : mode === 'new'
                    ? 'Create'
                    : 'Update'}
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
                  setForm((current: UserForm) => ({
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
                  setForm((current: UserForm) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="Enter email address"
                className={inputCls}
                disabled={saving}
              />
            </FormField>

            <FormField
              label={mode === 'new' ? 'Password' : 'New Password'}
              required={mode === 'new'}
            >
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current: UserForm) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder={
                  mode === 'new'
                    ? 'Minimum 6 characters'
                    : 'Leave blank to keep current password'
                }
                className={inputCls}
                disabled={saving}
              />
            </FormField>

            <FormField label="Role" required>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current: UserForm) => ({
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
                value={form.enabled ? 'active' : 'inactive'}
                onChange={(event) =>
                  setForm((current: UserForm) => ({
                    ...current,
                    enabled: event.target.value === 'active',
                  }))
                }
                className={selectCls}
                disabled={saving}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>
          </div>
        </Modal>
      ))}

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