import { useEffect, useMemo, useState } from 'react';
import {
  FileSearch,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';

import systemService, {
  type AuditLog,
} from '@/services/systemService';

import {
  DetailRow,
  Modal,
  ModalBtn,
} from '@/app/components/ui/Modal';

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-US');
}

function formatValue(value?: string | null) {
  if (!value) {
    return '-';
  }

  try {
    const parsed = JSON.parse(value);

    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
}

export function AuditLogs() {
  const [records, setRecords] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [selected, setSelected] =
    useState<AuditLog | null>(null);

  const load = async (showMainLoading = true) => {
    if (showMainLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError('');

    try {
      const response = await systemService.getAuditLogs({
        page: 0,
        size: 1000,
      });

      const data = Array.isArray(response)
        ? response
        : response.content ?? [];

      setRecords(data);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load audit logs.',
      );
    } finally {
      if (showMainLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    void load(true);

    const intervalId = window.setInterval(() => {
      void load(false);
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return records;
    }

    return records.filter((record) => {
      const username =
        record.user?.username?.toLowerCase() ?? '';

      const action =
        record.action?.toLowerCase() ?? '';

      const entity =
        record.entity?.toLowerCase() ?? '';

      const entityId =
        record.entityId !== undefined &&
        record.entityId !== null
          ? String(record.entityId).toLowerCase()
          : '';

      const ipAddress =
        record.ipAddress?.toLowerCase() ?? '';

      return (
        username.includes(keyword) ||
        action.includes(keyword) ||
        entity.includes(keyword) ||
        entityId.includes(keyword) ||
        ipAddress.includes(keyword)
      );
    });
  }, [records, search]);

  const handleRefresh = async () => {
    await load(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <FileSearch className="h-8 w-8 text-blue-600" />
            Audit Logs
          </h1>

          <p className="mt-1 text-gray-500">
            View all recorded system activities
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />

          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by user, action, entity, entity ID, or IP address..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Audit Logs
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {records.length}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Filtered Results
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600">
            {filtered.length}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Auto Refresh
          </p>

          <p className="mt-1 text-sm font-semibold text-green-600">
            Every 15 seconds
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading audit logs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {search.trim()
              ? 'No audit logs match your search.'
              : 'No audit logs found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    'User',
                    'Action',
                    'Entity',
                    'Entity ID',
                    'IP Address',
                    'Time',
                    'Actions',
                  ].map((header, index) => (
                    <th
                      key={`${header}-${index}`}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filtered.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {record.user?.username ?? 'System'}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {record.action ?? '-'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.entity ?? '-'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.entityId ?? '-'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {record.ipAddress ?? '-'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(record.timestamp)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => setSelected(record)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Audit Log Details"
        size="md"
        footer={
          <ModalBtn onClick={() => setSelected(null)}>
            Close
          </ModalBtn>
        }
      >
        {selected && (
          <div>
            <DetailRow
              label="User"
              value={
                selected.user?.username ?? 'System'
              }
            />

            <DetailRow
              label="Action"
              value={selected.action ?? '-'}
            />

            <DetailRow
              label="Entity"
              value={selected.entity ?? '-'}
            />

            <DetailRow
              label="Entity ID"
              value={String(
                selected.entityId ?? '-',
              )}
            />

            <DetailRow
              label="Previous Values"
              value={formatValue(
                selected.oldValues,
              )}
            />

            <DetailRow
              label="New Values"
              value={formatValue(
                selected.newValues,
              )}
            />

            <DetailRow
              label="IP Address"
              value={selected.ipAddress ?? '-'}
            />

            <DetailRow
              label="Time"
              value={formatDate(
                selected.timestamp,
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}