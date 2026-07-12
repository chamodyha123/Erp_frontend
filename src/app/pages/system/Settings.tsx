import { useEffect, useState } from 'react';
import {
  Save,
  Settings as SettingsIcon,
} from 'lucide-react';

import systemService, {
  type Setting as SystemSetting,
} from '@/services/systemService';

export function Settings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [edited, setEdited] = useState<
    Record<string, string>
  >({});

  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await systemService.getSettings();

      const data = Array.isArray(response)
        ? response
        : (response as any).content ?? [];

      setSettings(data);
    } catch (err: any) {
      console.error('Failed to load settings:', err);

      setSettings([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load system settings.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSave = async (
    key: string,
    id: number,
  ) => {
    if (!(key in edited)) {
      return;
    }

    setSaving(key);
    setError('');

    try {
      await systemService.updateSetting(id, {
        value: edited[key],
      });

      setEdited((current) => {
        const next = { ...current };
        delete next[key];

        return next;
      });

      await load();
    } catch (err: any) {
      console.error('Failed to update setting:', err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update the system setting.',
      );
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          System Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Configure system parameters
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-400">
          Loading data...
        </div>
      ) : settings.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
          No system settings found.
        </div>
      ) : (
        <div className="space-y-4">
          {settings.map((setting) => {
            const key = setting.key ?? '';

            const currentValue =
              edited[key] ?? setting.value ?? '';

            const hasChanges = key in edited;
            const isSaving = saving === key;

            return (
              <div
                key={setting.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {key || '-'}
                      </span>
                    </div>

                    {setting.description && (
                      <p className="mb-3 text-xs text-gray-500">
                        {setting.description}
                      </p>
                    )}

                    <input
                      type="text"
                      value={currentValue}
                      onChange={(event) =>
                        setEdited((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      disabled={isSaving || !key}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  {hasChanges && (
                    <button
                      type="button"
                      onClick={() =>
                        void handleSave(key, setting.id)
                      }
                      disabled={isSaving}
                      className="mt-6 flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />

                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}