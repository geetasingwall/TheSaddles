import { useState } from 'react';
import { publicApi } from '../../api';
import { Button } from '../Buttons/Button';
import styles from './TestimonialForm.module.css';

interface Props {
  prefillName?: string;
  customerType?: 'Student' | 'Parent';
  onDone?: () => void;
}

export function TestimonialForm({ prefillName = '', customerType = 'Student', onDone }: Props) {
  const [form, setForm] = useState({ customer_name: prefillName, rating: 5, testimonial: '' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.customer_name.trim() || !form.testimonial.trim()) { setError('Please fill in your name and testimonial.'); return; }
    setError('');
    setSaving(true);
    try {
      await publicApi.submitTestimonial({ ...form, customer_type: customerType });
      setDone(true);
      onDone?.();
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (done) return (
    <div className={styles.thanks}>
      <span>🙏</span>
      <p>Thank you for your feedback!</p>
    </div>
  );

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        placeholder="Your name"
        value={form.customer_name}
        onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
      />
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" className={`${styles.star} ${n <= form.rating ? styles.filled : ''}`}
            onClick={() => setForm(p => ({ ...p, rating: n }))}>★</button>
        ))}
      </div>
      <textarea
        className={styles.textarea}
        placeholder="Share your experience..."
        rows={3}
        value={form.testimonial}
        onChange={e => setForm(p => ({ ...p, testimonial: e.target.value }))}
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button size="sm" loading={saving} onClick={handleSubmit}>Submit Review</Button>
    </div>
  );
}
