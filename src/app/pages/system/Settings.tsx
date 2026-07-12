import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import systemService, { type Setting as SystemSetting } from '@/services/systemService';
export function Settings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string|null>(null);
  const [edited, setEdited] = useState<Record<string,string>>({});
  const load = () => { setLoading(true); systemService.getSettings().then(data=>{ setSettings(Array.isArray(data)?data:(data as any).content??[]); }).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const handleSave = (key: string, id: number) => {
    setSaving(key);
    systemService.updateSetting(id, { value: edited[key] })
      .then(()=>{ load(); setEdited(p=>{ const n={...p}; delete n[key]; return n; }); })
      .catch(console.error)
      .finally(()=>setSaving(null));
  };
  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><SettingsIcon className="w-8 h-8 text-blue-600" /> Pengaturan Sistem</h1><p className="text-gray-500 mt-1">Konfigurasi parameter sistem</p></div>
      {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <div className="space-y-4">
          {settings.map(s=>(
            <div key={s.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1"><span className="text-sm font-semibold text-gray-900">{s.settingKey??s.key??'-'}</span></div>
                  {s.description&&<p className="text-xs text-gray-500 mb-3">{s.description}</p>}
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={edited[s.settingKey??s.key??''] ?? s.settingValue ?? s.value ?? ''}
                    onChange={e=>setEdited(p=>({...p,[s.settingKey??s.key??'']:e.target.value}))}
                  />
                </div>
                {(s.settingKey??s.key) in edited && (
                  <button onClick={()=>handleSave(s.settingKey??s.key??'', s.id)} disabled={saving===( s.settingKey??s.key)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm mt-6 shrink-0">
                    <Save className="w-4 h-4" />{saving===(s.settingKey??s.key)?'Menyimpan...':'Simpan'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
