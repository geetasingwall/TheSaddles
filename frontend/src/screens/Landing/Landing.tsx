import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { publicApi } from '../../api';
import type { Facility, Horse, Testimonial } from '../../types';
import styles from './Landing.module.css';

function FacilityShowcase({ facilities }: { facilities: Facility[] }) {
  const [active, setActive] = useState(0);
  const f = facilities[active];
  return (
    <div className={styles.showcase}>
      <div className={styles.showcaseTabs}>
        {facilities.map((item, i) => (
          <button
            key={item.id}
            className={`${styles.showcaseTab} ${i === active ? styles.showcaseTabActive : ''}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.showcaseTabName}>{item.facility_name}</span>
            <span className={styles.showcaseTabArrow}>→</span>
          </button>
        ))}
        <Link to="/facilities" className={styles.showcaseViewAll}>
          <span>Explore All Facilities</span>
          <span className={styles.showcaseViewAllArrow}>→</span>
        </Link>
      </div>
      <div className={styles.showcasePanel}>
        {f.image_path
          ? <img key={f.id} src={`/uploads/${f.image_path}`} alt={f.facility_name} className={styles.showcaseImg} />
          : <div className={styles.showcasePlaceholder}>🏟️</div>
        }
        <div className={styles.showcaseOverlay}>
          <h3>{f.facility_name}</h3>
          {f.short_description && <p>{f.short_description}</p>}
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [trialFee, setTrialFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      publicApi.getFacilities().then(r => setFacilities((r.data as Facility[]) || [])),
      publicApi.getHorses().then(r => setHorses((r.data as Horse[]) || [])),
      publicApi.getTestimonials().then(r => setTestimonials((r.data as Testimonial[]) || [])),
      publicApi.getConfig().then(r => { const fee = (r.data as any)?.trial_fee; if (fee) setTrialFee(Number(fee)); }),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>"No hour of life is wasted that is spent in the saddle."</h1>
          <p className={styles.quoteAuthor}>— Winston S. Churchill</p>
          <p>Professional riding lessons, world-class facilities, and passionate coaches in Noida &amp; New Delhi.</p>
          <div className={styles.heroCtas}>
            <Link to="/trial-booking" className={styles.ctaPrimary}>Book a Trial Ride{trialFee ? ` — ₹${trialFee}` : ''}</Link>
            <Link to="/registration" className={styles.ctaSecondary}>Register Now</Link>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className={styles.facilitiesSection}>
        <div className={styles.facilitiesSectionHeader}>
          <span className={styles.facilitiesEyebrow}>Infrastructure</span>
          <h2>Our Facilities</h2>
          <p>Purpose-built spaces designed for an exceptional riding experience.</p>
        </div>
        {loading ? (
          <div className={styles.facilitySkeletonWrap}>
            <div className={styles.skeleton} />
          </div>
        ) : facilities.length > 0 ? (
          <FacilityShowcase facilities={facilities} />
        ) : null}
      </section>

      {/* Horses */}
      <section className={`${styles.section} ${styles.altBg}`}>
        <h2 className={styles.sectionTitle}>Meet Our Horses</h2>
        {loading ? (
          <div className={styles.grid}>
            {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : horses.length > 0 ? (
          <>
            <div className={styles.grid}>
              {horses.slice(0, 4).map(h => (
                <div key={h.id} className={styles.horseCard}>
                  {h.image_path
                    ? <img src={`/uploads/${h.image_path}`} alt={h.stable_name} className={styles.cardImg} />
                    : <div className={styles.horsePlaceholder}>🐴</div>
                  }
                  <div className={styles.cardBody}>
                    <h3>{h.stable_name}</h3>
                    {h.breed && <p>{h.breed}</p>}
                    {h.training_level && <span className={styles.badge}>{h.training_level}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.viewAll}><Link to="/horses">Meet All Horses →</Link></div>
          </>
        ) : null}
      </section>

      {/* Testimonials */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What Our Riders Say</h2>
        {loading ? (
          <div className={styles.testimonialScroll}>
            {[1,2,3].map(i => <div key={i} className={`${styles.testimonialCard} ${styles.skeletonCard}`} />)}
          </div>
        ) : testimonials.length === 0 ? (
          <p className={styles.emptySection}>Be the first to share your experience with us!</p>
        ) : (
          <div className={styles.testimonialScroll}>
            {testimonials.map(t => (
              <div key={t.id} className={styles.testimonialCard}>
                <div className={styles.stars}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p className={styles.testimonialText}>"{t.testimonial}"</p>
                <div className={styles.testimonialAuthor}>— {t.customer_name}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <h2>Ready to Start Your Riding Journey?</h2>
        <p>Join hundreds of riders who have discovered the joy of horse riding with us.</p>
        <div className={styles.heroCtas}>
          <Link to="/trial-booking" className={styles.ctaPrimary}>Book Trial Ride</Link>
          <Link to="/contact" className={styles.ctaSecondary}>Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
