import { useMemo, useState } from 'react';
import { Plus, Search, Shield } from 'lucide-react';

import { mockRoles } from '@/data/mockData';

import {
  DetailRow,
  FormField,
  inputCls,
  Modal,
  ModalBtn,
} from '@/app/components/ui/Modal';

type Role = (typeof mockRoles)[0];

type RoleForm = Omit<Role, 'id'>;

const blank = (): RoleForm => ({
  name: '',
  description: '',
  permissionsCount: 0,
  usersCount: 0,
  createdAt: '',
});

export function Roles() {
  const [items, setItems] = useState<Role[]>(mockRoles);
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState<
    'view' | 'new' | 'edit' | 'delete' | null
  >(null);

  const [selected, setSelected] =
    useState<Role | null>(null);

  const [form, setForm] = useState<RoleForm>(blank());

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    );
  }, [items, search]);

  const close = () => {
    setModal(null);
    setSelected(null);
    setForm(blank());
  };

  const handleNew = () => {
    const newRole: Role = {
      id: String(Date.now()),
      ...form,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setItems((current) => [...current, newRole]);
    close();
  };

  const handleEdit = () => {
    if (!selected) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              ...form,
            }
          : item,
      ),
    );

    close();
  };

  const handleDelete = () => {
    if (!selected) {
      return;
    }

    setItems((current) =>
      current.filter((item) => item.id !== selected.id),
    );

    close();
  };

  const openEdit = (role: Role) => {
    setSelected(role);

    setForm({
      name: role.name,
      description: role.description,
      permissionsCount: role.permissionsCount,
      usersCount: role.usersCount,
      createdAt: role.createdAt,
    });

    setModal('edit');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <Shield className="h-8 w-8 text-blue-600" />
            Roles & Permissions
          </h1>

          <p className="mt-1 text-gray-500">
            Manage system roles and access permissions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal('new')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Role
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Total Roles
          </p>

          <p className="text-2xl font-bold text-gray-900">
            {items.length}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Total Permissions
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {items.reduce(
              (total, item) =>
                total + item.permissionsCount,
              0,
            )}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Linked Users
          </p>

          <p className="text-2xl font-bold text-purple-600">
            {items.reduce(
              (total, item) => total + item.usersCount,
              0,
            )}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search roles..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {[
                  'Role Name',
                  'Description',
                  'Permissions',
                  'Users',
                  'Created At',
                  'Actions',
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filtered.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {role.name}
                  </td>

                  <td className="max-w-[200px] px-4 py-4 text-sm text-gray-600">
                    {role.description}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {role.permissionsCount}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {role.usersCount}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {role.createdAt}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(role);
                          setModal('view');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(role)}
                        className="text-sm text-yellow-600 hover:text-yellow-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelected(role);
                          setModal('delete');
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modal === 'view'}
        onClose={close}
        title="Role Details"
        size="md"
        footer={<ModalBtn onClick={close}>Close</ModalBtn>}
      >
        {selected && (
          <div>
            <DetailRow
              label="Role Name"
              value={selected.name}
            />

            <DetailRow
              label="Description"
              value={selected.description}
            />

            <DetailRow
              label="Permissions"
              value={selected.permissionsCount}
            />

            <DetailRow
              label="Users"
              value={selected.usersCount}
            />

            <DetailRow
              label="Created At"
              value={selected.createdAt}
            />
          </div>
        )}
      </Modal>

      {[
        {
          mode: 'new' as const,
          title: 'Add Role',
        },
        {
          mode: 'edit' as const,
          title: 'Edit Role',
        },
      ].map(({ mode, title }) => (
        <Modal
          key={mode}
          open={modal === mode}
          onClose={close}
          title={title}
          size="md"
          footer={
            <>
              <ModalBtn onClick={close}>
                Cancel
              </ModalBtn>

              <ModalBtn
                variant="primary"
                onClick={
                  mode === 'new'
                    ? handleNew
                    : handleEdit
                }
              >
                Save
              </ModalBtn>
            </>
          }
        >
          <div className="space-y-4">
            <FormField label="Role Name" required>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className={inputCls}
              />
            </FormField>

            <FormField label="Description">
              <input
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className={inputCls}
              />
            </FormField>

            <FormField label="Permission Count">
              <input
                type="number"
                min="0"
                value={form.permissionsCount || ''}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    permissionsCount: Number(
                      event.target.value,
                    ),
                  }))
                }
                className={inputCls}
              />
            </FormField>
          </div>
        </Modal>
      ))}

      <Modal
        open={modal === 'delete'}
        onClose={close}
        title="Delete Role"
        size="sm"
        footer={
          <>
            <ModalBtn onClick={close}>
              Cancel
            </ModalBtn>

            <ModalBtn
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </ModalBtn>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete the role{' '}
          <strong>{selected?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
}