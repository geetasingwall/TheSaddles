import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Button } from '../../components/Buttons/Button';
import { Input } from '../../components/Inputs/Input';
import styles from './AdminConfiguration.module.css';

interface ConfigRow {
  id: string;
  category: string;
  key: string;
  string_value: string | null;
  integer_value: number | null;
  boolean_value: boolean | null;
  json_value: unknown;
  description: string | null;
}

interface Location {
  id: string;
  branch_name: string;
  address_line_1: string;
  city: string;
  state: string;
  contact_number?: string;
  latitude?: number | null;
  longitude?: number | null;
  short_description?: string;
  is_active: boolean;
}

const EMPTY_LOC = { branch_name: '', address_line_1: '', city: '', state: 'Delhi', contact_number: '', latitude: '', longitude: '', short_description: '' };

function valueType(row: ConfigRow): 'string' | 'integer' | 'boolean' | 'json' {
  if (row.integer_value !== null) return 'integer';
  if (row.boolean_value !== null) return 'boolean';
  if (row.json_value !== null) return 'json';
  return 'string';
}

function displayValue(row: ConfigRow): string {
  if (row.integer_value !== null) return String(row.integer_value);
  if (row.boolean_value !== null) return String(row.boolean_value);
  if (row.json_value !== null) return JSON.stringify(row.json_value, null, 2);
  return row.string_value ?? '';
}

export function AdminConfiguration() {
  const [configs, setConfigs] = useState<ConfigRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [locations, setLocations] = useState<Location[]>([]);
  const [editingLoc, setEditingLoc] = useState<string | null>(null); // id or 'new'
  const [locForm, setLocForm] = useState<typeof EMPTY_LOC>({ ...EMPTY_LOC });
  const [savingLoc, setSavingLoc] = useState(false);

  const loadAll = () => {
    adminApi.getConfiguration().then(r => { if (r.success) setConfigs(r.data as ConfigRow[]); });
    adminApi.getLocations().then(r => { if (r.success) setLocations((r.data as Location[]) || []); });
  };

  useEffect(() => { loadAll(); }, []);

  // ── Config editing ──────────────────────────────────────────────────────
  const grouped = configs.reduce<Record<string, ConfigRow[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  function startEdit(row: ConfigRow) {
    setEditing(row.id);
    setEditVal(displayValue(row));
    setMsg('');
  }

  async function saveConfig(row: ConfigRow) {
    setSaving(true);
    const type = valueType(row);
    const payload: Record<string, unknown> = {};
    if (type === 'integer') payload.integer_value = parseInt(editVal, 10);
    else if (type === 'boolean') payload.boolean_value = editVal === 'true';
    else if (type === 'json') {
      try { payload.json_value = JSON.parse(editVal); }
      catch { setMsg('Invalid JSON'); setSaving(false); return; }
    } else payload.string_value = editVal;

    const r = await adminApi.updateConfiguration(row.category, row.key, payload);
    if (r.success) {
      setConfigs(prev => prev.map(c => c.id === row.id ? { ...c, ...payload } : c));
      setMsg('✅ Saved');
    } else {
      setMsg('❌ Failed to save');
    }
    setEditing(null);
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  }

  // ── Location editing ────────────────────────────────────────────────────
  function startEditLoc(loc: Location) {
    setEditingLoc(loc.id);
    setLocForm({
      branch_name: loc.branch_name,
      address_line_1: loc.address_line_1,
      city: loc.city,
      state: loc.state,
      contact_number: loc.contact_number || '',
      latitude: loc.latitude != null ? String(loc.latitude) : '',
      longitude: loc.longitude != null ? String(loc.longitude) : '',
      short_description: loc.short_description || '',
    });
  }

  async function saveLoc() {
    if (!locForm.branch_name || !locForm.address_line_1 || !locForm.city) return;
    setSavingLoc(true);
    const payload: Record<string, unknown> = {
      branch_name: locForm.branch_name,
      address_line_1: locForm.address_line_1,
      city: locForm.city,
      state: locForm.state,
    };
    if (locForm.contact_number) payload.contact_number = locForm.contact_number;
    if (locForm.latitude !== '')  payload.latitude  = parseFloat(locForm.latitude as string);
    if (locForm.longitude !== '') payload.longitude = parseFloat(locForm.longitude as string);
    if (locForm.short_description) payload.short_description = locForm.short_description;
    try {
      if (editingLoc === 'new') {
        await adminApi.createLocation(payload as any);
      } else if (editingLoc) {
        await adminApi.updateLocation(editingLoc, payload as any);
      }
      setEditingLoc(null);
      setLocForm({ ...EMPTY_LOC });
      loadAll();
    } finally {
      setSavingLoc(false);
    }
  }

  async function toggleLocActive(loc: Location) {
    await adminApi.updateLocation(loc.id, { is_active: !loc.is_active } as any);
    loadAll();
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>⚙️ System Configuration</h2>
      {msg && <div className={styles.toast}>{msg}</div>}

      {/* ── Locations ─────────────────────────────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.category}>LOCATIONS</h3>
        <div className={styles.locList}>
          {locations.map(loc => (
            <div key={loc.id} className={`${styles.locCard} ${!loc.is_active ? styles.inactive : ''}`}>
              {editingLoc === loc.id ? (
                <div className={styles.locForm}>
                  <Input label="Branch Name *" value={locForm.branch_name} onChange={e => setLocForm(p => ({ ...p, branch_name: e.target.value }))} />
                  <Input label="Address *" value={locForm.address_line_1} onChange={e => setLocForm(p => ({ ...p, address_line_1: e.target.value }))} />
                  <Input label="City *" value={locForm.city} onChange={e => setLocForm(p => ({ ...p, city: e.target.value }))} />
                  <Input label="State" value={locForm.state} onChange={e => setLocForm(p => ({ ...p, state: e.target.value }))} />
                  <Input label="Contact Number" value={locForm.contact_number} onChange={e => setLocForm(p => ({ ...p, contact_number: e.target.value }))} />
                  <Input label="Latitude (for map)" placeholder="e.g. 28.6139" value={locForm.latitude} onChange={e => setLocForm(p => ({ ...p, latitude: e.target.value }))} />
                  <Input label="Longitude (for map)" placeholder="e.g. 77.2090" value={locForm.longitude} onChange={e => setLocForm(p => ({ ...p, longitude: e.target.value }))} />
                  <Input label="Short Description" value={locForm.short_description} onChange={e => setLocForm(p => ({ ...p, short_description: e.target.value }))} />
                  <div className={styles.locActions}>
                    <Button size="sm" loading={savingLoc} onClick={saveLoc}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingLoc(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className={styles.locRow}>
                  <div className={styles.locInfo}>
                    <strong>{loc.branch_name}</strong>
                    <span>{loc.address_line_1}, {loc.city}, {loc.state}</span>
                    {loc.contact_number && <span>📞 {loc.contact_number}</span>}
                    {loc.latitude && loc.longitude
                      ? <span className={styles.coords}>📍 {loc.latitude}, {loc.longitude}</span>
                      : <span className={styles.noCoords}>⚠️ No coordinates — map won't show</span>
                    }
                  </div>
                  <div className={styles.locBtns}>
                    <button className={styles.editBtn} onClick={() => startEditLoc(loc)}>Edit</button>
                    <button className={styles.editBtn} style={{ background: loc.is_active ? '#dc3545' : '#28a745' }} onClick={() => toggleLocActive(loc)}>
                      {loc.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {editingLoc === 'new' ? (
          <div className={styles.locForm} style={{ marginTop: 16 }}>
            <Input label="Branch Name *" value={locForm.branch_name} onChange={e => setLocForm(p => ({ ...p, branch_name: e.target.value }))} />
            <Input label="Address *" value={locForm.address_line_1} onChange={e => setLocForm(p => ({ ...p, address_line_1: e.target.value }))} />
            <Input label="City *" value={locForm.city} onChange={e => setLocForm(p => ({ ...p, city: e.target.value }))} />
            <Input label="State" value={locForm.state} onChange={e => setLocForm(p => ({ ...p, state: e.target.value }))} />
            <Input label="Contact Number" value={locForm.contact_number} onChange={e => setLocForm(p => ({ ...p, contact_number: e.target.value }))} />
            <Input label="Latitude (for map)" placeholder="e.g. 28.6139" value={locForm.latitude} onChange={e => setLocForm(p => ({ ...p, latitude: e.target.value }))} />
            <Input label="Longitude (for map)" placeholder="e.g. 77.2090" value={locForm.longitude} onChange={e => setLocForm(p => ({ ...p, longitude: e.target.value }))} />
            <Input label="Short Description" value={locForm.short_description} onChange={e => setLocForm(p => ({ ...p, short_description: e.target.value }))} />
            <div className={styles.locActions}>
              <Button size="sm" loading={savingLoc} onClick={saveLoc}>Save Location</Button>
              <Button size="sm" variant="secondary" onClick={() => { setEditingLoc(null); setLocForm({ ...EMPTY_LOC }); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button className={styles.editBtn} style={{ marginTop: 12 }} onClick={() => { setEditingLoc('new'); setLocForm({ ...EMPTY_LOC }); }}>
            + Add Location
          </button>
        )}
      </div>

      {/* ── All other config groups ────────────────────────────────────── */}
      {Object.entries(grouped).map(([category, rows]) => (
        <div key={category} className={styles.section}>
          <h3 className={styles.category}>{category}</h3>
          <table className={styles.table}>
            <thead>
              <tr><th>Key</th><th>Value</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td className={styles.key}>{row.key}</td>
                  <td className={styles.val}>
                    {editing === row.id ? (
                      valueType(row) === 'boolean' ? (
                        <select value={editVal} onChange={e => setEditVal(e.target.value)} className={styles.input}>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : valueType(row) === 'json' ? (
                        <textarea value={editVal} onChange={e => setEditVal(e.target.value)} className={styles.textarea} rows={4} />
                      ) : (
                        <input value={editVal} onChange={e => setEditVal(e.target.value)} className={styles.input} type={valueType(row) === 'integer' ? 'number' : 'text'} />
                      )
                    ) : (
                      <span className={styles.valText}>{displayValue(row)}</span>
                    )}
                  </td>
                  <td className={styles.desc}>{row.description}</td>
                  <td className={styles.actions}>
                    {editing === row.id ? (
                      <>
                        <button onClick={() => saveConfig(row)} disabled={saving} className={styles.saveBtn}>Save</button>
                        <button onClick={() => setEditing(null)} className={styles.cancelBtn}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(row)} className={styles.editBtn}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
