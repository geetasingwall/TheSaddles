import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Card } from '../../components/Cards/Card';
import { Button } from '../../components/Buttons/Button';
import { Input, Select } from '../../components/Inputs/Input';
import styles from './AdminTestimonials.module.css';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_type: string;
  rating: number;
  testimonial: string;
  is_approved: boolean;
  is_active: boolean;
}

const RATINGS = [1, 2, 3, 4, 5];

export function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_name: '', customer_type: 'Student', rating: '5', testimonial: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    adminApi.getTestimonials().then(r => setItems((r.data as Testimonial[]) || [])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.customer_name.trim() || !form.testimonial.trim()) { setError('Name and testimonial are required.'); return; }
    setError('');
    setSaving(true);
    try {
      await adminApi.createTestimonial({
        customer_name: form.customer_name,
        customer_type: form.customer_type,
        rating: Number(form.rating),
        testimonial: form.testimonial,
        show_on_homepage: true,
      });
      setForm({ customer_name: '', customer_type: 'Student', rating: '5', testimonial: '' });
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (t: Testimonial, field: 'is_approved' | 'is_active') => {
    await adminApi.updateTestimonial(t.id, { [field]: !t[field] });
    load();
  };

  if (loading) return <div className={styles.loading}>Loading testimonials...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Testimonials 💬</h1>
        <p>Approved testimonials appear on the home page.</p>
      </div>

      <Card title={`Testimonials (${items.length})`}>
        {items.length === 0 ? (
          <p className={styles.empty}>No testimonials yet.</p>
        ) : (
          <div className={styles.list}>
            {items.map(t => (
              <div key={t.id} className={styles.item}>
                <div className={styles.itemTop}>
                  <div>
                    <span className={styles.name}>{t.customer_name}</span>
                    <span className={styles.meta}> · {t.customer_type} · {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                  </div>
                  <div className={styles.badges}>
                    <span className={t.is_approved ? styles.approved : styles.pending}>
                      {t.is_approved ? '✅ Approved' : '⏳ Pending'}
                    </span>
                    <span className={t.is_active ? styles.active : styles.inactive}>
                      {t.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <p className={styles.text}>"{t.testimonial}"</p>
                <div className={styles.actions}>
                  <Button size="sm" variant={t.is_approved ? 'secondary' : 'primary'} onClick={() => toggle(t, 'is_approved')}>
                    {t.is_approved ? 'Unapprove' : 'Approve'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => toggle(t, 'is_active')}>
                    {t.is_active ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)} style={{ marginTop: 16 }}>+ Add Testimonial</Button>
        ) : (
          <div className={styles.form}>
            <Input placeholder="Customer Name *" value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} />
            <Select
              label="Type"
              options={[{ value: 'Student', label: 'Student' }, { value: 'Parent', label: 'Parent' }]}
              value={form.customer_type}
              onChange={e => setForm(p => ({ ...p, customer_type: e.target.value }))}
            />
            <Select
              label="Rating"
              options={RATINGS.map(r => ({ value: String(r), label: '★'.repeat(r) + '☆'.repeat(5 - r) }))}
              value={form.rating}
              onChange={e => setForm(p => ({ ...p, rating: e.target.value }))}
            />
            <textarea
              className={styles.textarea}
              placeholder="Testimonial text *"
              rows={3}
              value={form.testimonial}
              onChange={e => setForm(p => ({ ...p, testimonial: e.target.value }))}
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
              <Button size="sm" loading={saving} onClick={handleAdd}>Save</Button>
              <Button size="sm" variant="secondary" onClick={() => { setShowForm(false); setError(''); }}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
