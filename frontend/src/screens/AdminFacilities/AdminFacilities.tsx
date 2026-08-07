import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Button } from '../../components/Buttons/Button';
import { Input } from '../../components/Inputs/Input';
import { Card } from '../../components/Cards/Card';
import styles from './AdminFacilities.module.css';

interface Facility {
  id: string;
  facility_name: string;
  short_description?: string;
  detailed_description?: string;
  image_path?: string;
  show_on_homepage: boolean;
  is_active: boolean;
}

interface EditState {
  facility_name: string;
  short_description: string;
  detailed_description: string;
}

export function AdminFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ facility_name: '', short_description: '', detailed_description: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ facility_name: '', short_description: '', detailed_description: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [cacheBust, setCacheBust] = useState<Record<string, number>>({});

  const load = () => {
    adminApi.getFacilities().then(r => setFacilities((r.data as Facility[]) || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.facility_name) return;
    setSaving(true);
    try {
      await adminApi.createFacility({
        facility_name: form.facility_name,
        short_description: form.short_description || undefined,
        detailed_description: form.detailed_description || undefined,
      });
      setForm({ facility_name: '', short_description: '', detailed_description: '' });
      setShowForm(false);
      load();
    } finally { setSaving(false); }
  };

  const startEdit = (f: Facility) => {
    setEditingId(f.id);
    setEditState({
      facility_name: f.facility_name,
      short_description: f.short_description ?? '',
      detailed_description: f.detailed_description ?? '',
    });
  };

  const saveEdit = async (id: string) => {
    setEditSaving(true);
    await adminApi.updateFacility(id, {
      facility_name: editState.facility_name || undefined,
      short_description: editState.short_description || undefined,
      detailed_description: editState.detailed_description || undefined,
    });
    setEditingId(null);
    setEditSaving(false);
    load();
  };

  const handleToggle = async (f: Facility) => {
    await adminApi.updateFacility(f.id, { is_active: !f.is_active });
    load();
  };

  const handleHomepageToggle = async (f: Facility) => {
    await adminApi.updateFacility(f.id, { show_on_homepage: !f.show_on_homepage });
    load();
  };

  const handleImageUpload = async (id: string, file: File) => {
    setUploadingId(id);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch(`/api/v1/admin/facilities/${id}/upload`, { method: 'POST', body: formData });
      setCacheBust(p => ({ ...p, [id]: Date.now() }));
      load();
    } finally { setUploadingId(null); }
  };

  if (loading) return <div className={styles.loading}>Loading facilities...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1>🏟️ Facilities</h1></div>

      <Card title={`Facilities (${facilities.length})`}>
        {facilities.map(f => (
          <div key={f.id} className={styles.facilityBlock}>
            <div className={styles.row}>
              {/* Thumbnail */}
              <div className={styles.thumbWrap}>
                {f.image_path
                  ? <img src={`/uploads/${f.image_path}?v=${cacheBust[f.id] ?? 0}`} alt={f.facility_name} className={styles.thumb} />
                  : <div className={styles.placeholder}>🏟️</div>
                }
                <label className={styles.uploadOverlay} title="Upload image">
                  {uploadingId === f.id ? '⏳' : '📷'}
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(f.id, file); e.target.value = ''; }}
                  />
                </label>
              </div>

              {/* Info */}
              <div className={styles.info}>
                <span className={styles.name}>{f.facility_name}</span>
                {f.short_description && <span className={styles.shortDesc}>{f.short_description}</span>}
                {f.detailed_description && <span className={styles.detailDesc}>{f.detailed_description}</span>}
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => editingId === f.id ? setEditingId(null) : startEdit(f)}>
                  {editingId === f.id ? '✕' : '✏️'}
                </button>
                <button
                  className={`${styles.badgeBtn} ${f.show_on_homepage ? styles.badgeOn : styles.badgeOff}`}
                  onClick={() => handleHomepageToggle(f)}
                  title={f.show_on_homepage ? 'Shown on homepage' : 'Hidden from homepage'}
                >
                  🏠
                </button>
                <button className={styles.toggleBtn} onClick={() => handleToggle(f)}
                  title={f.is_active ? 'Deactivate' : 'Activate'}>
                  {f.is_active ? '✅' : '❌'}
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            {editingId === f.id && (
              <div className={styles.editForm}>
                <Input label="Name" value={editState.facility_name}
                  onChange={e => setEditState(p => ({ ...p, facility_name: e.target.value }))} />
                <Input label="Short Description (shown on homepage)"
                  value={editState.short_description}
                  onChange={e => setEditState(p => ({ ...p, short_description: e.target.value }))} />
                <div className={styles.fullCol}>
                  <label className={styles.textareaLabel}>Detailed Description</label>
                  <textarea className={styles.textarea} rows={3}
                    value={editState.detailed_description}
                    onChange={e => setEditState(p => ({ ...p, detailed_description: e.target.value }))}
                  />
                </div>
                <div className={styles.editActions}>
                  <Button size="sm" loading={editSaving} onClick={() => saveEdit(f.id)}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!showForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)} style={{ marginTop: 12 }}>+ Add Facility</Button>
        ) : (
          <div className={styles.addForm}>
            <Input placeholder="Facility Name *" value={form.facility_name}
              onChange={e => setForm(p => ({ ...p, facility_name: e.target.value }))} />
            <Input placeholder="Short Description (homepage)" value={form.short_description}
              onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} />
            <div className={styles.fullCol}>
              <label className={styles.textareaLabel}>Detailed Description</label>
              <textarea className={styles.textarea} rows={3} placeholder="Full description..."
                value={form.detailed_description}
                onChange={e => setForm(p => ({ ...p, detailed_description: e.target.value }))}
              />
            </div>
            <div className={styles.editActions}>
              <Button size="sm" onClick={handleAdd} loading={saving}>Save</Button>
              <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
