import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Card } from '../../components/Cards/Card';
import { Button } from '../../components/Buttons/Button';
import { Input, Select } from '../../components/Inputs/Input';
import styles from './AdminHorses.module.css';

interface Horse {
  id: string;
  name?: string;
  stable_name: string;
  breed?: string;
  color?: string;
  gender?: string;
  training_level?: string;
  image_path?: string;
  gallery_images?: string[];
  is_active: boolean;
}

export function AdminHorses() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ stable_name: '', breed: '', color: '', gender: '', training_level: '' });
  const [saving, setSaving] = useState(false);

  const load = () =>
    adminApi.getHorses().then(r => setHorses((r.data as Horse[]) || [])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete horse "${name}"? This cannot be undone.`)) return;
    await adminApi.deleteHorse(id);
    load();
  };

  const handleGalleryUpload = async (horseId: string, file: File) => {
    setUploading(horseId);
    try {
      await adminApi.uploadHorseGallery(horseId, file);
      load();
    } finally {
      setUploading(null);
    }
  };

  const handleGalleryDelete = async (horseId: string, index: number) => {
    await adminApi.deleteHorseGalleryPhoto(horseId, index);
    load();
  };

  const handleAdd = async () => {
    if (!form.stable_name.trim()) return;
    setSaving(true);
    try {
      await adminApi.createHorse({
        stable_name: form.stable_name,
        breed: form.breed || undefined,
        color: form.color || undefined,
        gender: form.gender || undefined,
        training_level: form.training_level || undefined,
      });
      setForm({ stable_name: '', breed: '', color: '', gender: '', training_level: '' });
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading horses...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Horses 🐴</h1>
        <p>{horses.length} horse{horses.length !== 1 ? 's' : ''} in the system</p>
      </div>

      <Card title="Manage Horses">
        {horses.length === 0 && <p className={styles.empty}>No horses yet.</p>}

        {horses.map(h => {
          const isOpen = expandedId === h.id;
          const gallery = h.gallery_images || [];
          const canUpload = gallery.length < 5;
          return (
            <div key={h.id} className={styles.horseCard}>
              <div className={styles.horseRow} onClick={() => setExpandedId(isOpen ? null : h.id)}>
                <div className={styles.horseThumb}>
                  {h.image_path
                    ? <img src={`/uploads/${h.image_path}`} alt={h.stable_name} />
                    : <span>🐴</span>}
                </div>
                <div className={styles.horseInfo}>
                  <span className={styles.horseName}>{h.stable_name}</span>
                  <span className={styles.horseMeta}>
                    {[h.breed, h.color, h.gender, h.training_level].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <div className={styles.horseActions} onClick={e => e.stopPropagation()}>
                  <span className={styles.photoCount}>{gallery.length}/5 photos</span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(h.id, h.stable_name)}
                    title="Delete horse"
                  >🗑</button>
                  <span className={styles.toggle}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className={styles.expanded}>
                  <p className={styles.galleryLabel}>Gallery Photos ({gallery.length}/5) — shown when visitors click this horse</p>
                  <div className={styles.galleryGrid}>
                    {gallery.map((path, i) => (
                      <div key={i} className={styles.galleryItem}>
                        <img src={`/uploads/${path}`} alt={`Photo ${i + 1}`} />
                        <button
                          className={styles.removePhoto}
                          onClick={() => handleGalleryDelete(h.id, i)}
                          title="Remove photo"
                        >✕</button>
                      </div>
                    ))}
                    {canUpload && (
                      <label className={styles.uploadSlot}>
                        {uploading === h.id ? (
                          <span>⏳</span>
                        ) : (
                          <>
                            <span className={styles.uploadIcon}>+</span>
                            <span className={styles.uploadText}>Add Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          disabled={uploading === h.id}
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) handleGalleryUpload(h.id, f);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {!canUpload && <p className={styles.maxReached}>Maximum 5 photos reached. Remove one to add another.</p>}
                </div>
              )}
            </div>
          );
        })}

        {!showForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)} style={{ marginTop: 16 }}>+ Add Horse</Button>
        ) : (
          <div className={styles.form}>
            <Input placeholder="Stable Name *" value={form.stable_name} onChange={e => setForm(p => ({ ...p, stable_name: e.target.value }))} />
            <Input placeholder="Breed" value={form.breed} onChange={e => setForm(p => ({ ...p, breed: e.target.value }))} />
            <Input placeholder="Color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
            <Select label="Gender" options={[{ value: '', label: 'Select gender' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
              value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} />
            <Select label="Training Level" options={[{ value: '', label: 'Select level' }, { value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]}
              value={form.training_level} onChange={e => setForm(p => ({ ...p, training_level: e.target.value }))} />
            <div className={styles.formActions}>
              <Button size="sm" loading={saving} onClick={handleAdd}>Save Horse</Button>
              <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
