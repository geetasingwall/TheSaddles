import { useEffect, useState } from 'react';
import { publicApi } from '../../api';
import type { Testimonial } from '../../types';
import styles from './Testimonials.module.css';

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getTestimonials().then(r => setItems((r.data as Testimonial[]) || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading testimonials...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>What Our Riders Say</h1>
        <p>Real experiences from our students and their families.</p>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>No testimonials yet. Check back soon!</p>
      ) : (
        <div className={styles.grid}>
          {items.map(t => (
            <div key={t.id} className={styles.card}>
              <div className={styles.stars}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              <p className={styles.text}>"{t.testimonial}"</p>
              <div className={styles.author}>
                <span className={styles.name}>— {t.customer_name}</span>
                <span className={styles.type}>{t.customer_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
