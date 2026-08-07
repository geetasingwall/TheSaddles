import { useState } from 'react';
import styles from './Facilities.module.css';

const SERVICES = [
  {
    key: 'training',
    icon: '🏇',
    title: 'Horse Training',
    tagline: 'Professional training programmes for horses at every level.',
    details: [
      { icon: '🎯', heading: 'Groundwork & Basics', body: 'Foundation training covering haltering, leading, lunging, and desensitisation for young or green horses.' },
      { icon: '📈', heading: 'Progressive Levels', body: 'Structured programmes from Starter through to Advanced, with regular assessments and progress reports.' },
      { icon: '🏆', heading: 'Competition Prep', body: 'Specialised conditioning, flatwork refinement, and course schooling for horses entering shows and events.' },
      { icon: '🤝', heading: 'Owner Involvement', body: 'Owners are kept informed at every stage with weekly updates and open training sessions.' },
    ],
  },
  {
    key: 'coaching',
    icon: '🎓',
    title: 'Horse Riding Coaching',
    tagline: 'Expert coaches guiding beginners to competitive riders.',
    details: [
      { icon: '🌱', heading: 'Beginner Lessons', body: 'Safe, confidence-building sessions introducing seat, balance, and basic rein aids on calm, schooled horses.' },
      { icon: '🔄', heading: 'Intermediate Development', body: 'Canter work, transitions, pole work, and introduction to jumping for riders with a solid foundation.' },
      { icon: '🥇', heading: 'Advanced & Competitive', body: 'Intensive coaching for dressage, show jumping, and cross-country with video analysis and tailored plans.' },
      { icon: '👨‍👩‍👧', heading: 'Group & Private', body: 'Both group batch sessions and one-on-one private lessons available to suit every schedule and budget.' },
    ],
  },
  {
    key: 'livery',
    icon: '🏠',
    title: 'Horse Livery',
    tagline: 'Full and part livery with premium stabling and daily care.',
    details: [
      { icon: '🛏️', heading: 'Premium Stabling', body: 'Spacious, well-ventilated loose boxes with deep bedding, automatic drinkers, and daily mucking out.' },
      { icon: '🌿', heading: 'Nutrition & Feeding', body: 'Individually tailored feeding plans using quality forage and hard feed, managed by our experienced yard team.' },
      { icon: '🩺', heading: 'Health Monitoring', body: 'Daily health checks, farrier visits, and coordination with your vet for vaccinations and dental care.' },
      { icon: '🌳', heading: 'Turnout & Exercise', body: 'Daily turnout in safe paddocks and optional exercise or schooling included in full livery packages.' },
    ],
  },
  {
    key: 'lease',
    icon: '🤝',
    title: 'Horse Lease',
    tagline: 'Flexible lease options for events, hacks, and competitions.',
    details: [
      { icon: '📅', heading: 'Flexible Terms', body: 'Short-term and long-term lease agreements available — from a single event day to a full season.' },
      { icon: 'LOGO', heading: 'Matched to Rider', body: 'We match each lessee with a horse suited to their experience level, discipline, and goals.' },
      { icon: '📋', heading: 'Clear Agreements', body: 'Transparent lease contracts covering usage, care responsibilities, insurance, and veterinary costs.' },
      { icon: '🎪', heading: 'Event & Competition Use', body: 'Horses available for show jumping, polo, dressage, hacks, and cross-country under lease arrangements.' },
    ],
  },
];

export function Facilities() {
  const [activeKey, setActiveKey] = useState<string | null>('training');
  const active = SERVICES.find(s => s.key === activeKey) ?? null;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>World-Class Infrastructure</span>
          <h1>Our Facilities</h1>
          <p>Purpose-built spaces designed for riders of every level — from first-timers to competitive athletes.</p>
        </div>
        <svg className={styles.heroWave} viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 48h1440V24C1200 0 960 48 720 24S240 0 0 24V48z" fill="var(--bg)" />
        </svg>
      </div>

      {/* Services Strip */}
      <div className={styles.servicesStrip}>
        {SERVICES.map(s => (
          <button
            key={s.key}
            className={`${styles.serviceItem} ${activeKey === s.key ? styles.serviceItemActive : ''}`}
            onClick={() => setActiveKey(activeKey === s.key ? null : s.key)}
          >
            <span className={styles.serviceIcon}>{s.icon}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.tagline}</p>
            </div>
            <span className={styles.serviceChevron}>{activeKey === s.key ? '▲' : '▼'}</span>
          </button>
        ))}
      </div>

      {/* Inline Detail Panel */}
      {active && (
        <div className={styles.detailPanel}>
          <div className={styles.detailInner}>
            <div className={styles.detailHeader}>
              <span className={styles.detailIcon}>{active.icon}</span>
              <div>
                <h2>{active.title}</h2>
                <p>{active.tagline}</p>
              </div>
            </div>
            <div className={styles.detailGrid}>
              {active.details.map(d => (
                <div key={d.heading} className={styles.detailCard}>
                  {d.icon === 'LOGO'
                    ? <img src="/logo.jpg" alt="Club Logo" className={styles.detailCardLogo} />
                    : <span className={styles.detailCardIcon}>{d.icon}</span>
                  }
                  <h4>{d.heading}</h4>
                  <p>{d.body}</p>
                </div>
              ))}
            </div>
            {active.key === 'lease' && (
              <div className={styles.leaseNote}>
                <img src="/logo.jpg" alt="Club Logo" className={styles.leaseNoteLogo} /> Looking for a horse to lease? <a href="/horses">Browse our available horses →</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Equipment Section */}
      <div className={styles.equipSection}>
        <div className={styles.equipInner}>
          <div className={styles.equipHeader}>
            <span className={styles.equipEyebrow}>Gear &amp; Equipment</span>
            <h2>Horse Riding Equipment</h2>
            <p>Everything our riders need — maintained to the highest safety standards and available at the club.</p>
          </div>
          <div className={styles.equipGrid}>
            {[
              { icon: '🪖', name: 'Riding Helmets', desc: 'Certified safety helmets available in all sizes for juniors and adults.' },
              { icon: '🥾', name: 'Riding Boots', desc: 'Sturdy ankle and knee-high boots providing grip and ankle support in the stirrups.' },
              { icon: '🦺', name: 'Body Protectors', desc: 'Impact-absorbing vests worn during jumping and cross-country sessions.' },
              { icon: '🧤', name: 'Riding Gloves', desc: 'Grippy gloves that protect hands and improve rein control.' },
              { icon: 'LOGO', name: 'Saddles', desc: 'English and Western saddles fitted per horse for comfort and correct posture.' },
              { icon: '🔗', name: 'Bridles & Bits', desc: 'Properly fitted bridles ensuring clear, humane communication with the horse.' },
              { icon: '🪢', name: 'Stirrups & Leathers', desc: 'Adjustable stirrups for correct leg position and balance at all gaits.' },
              { icon: '🧴', name: 'Grooming Kit', desc: 'Brushes, hoof picks, and coat conditioners — students learn horse care as part of training.' },
            ].map(item => (
              <div key={item.name} className={styles.equipCard}>
                {item.icon === 'LOGO'
                  ? <img src="/logo.jpg" alt="Club Logo" className={styles.equipLogo} />
                  : <span className={styles.equipIcon}>{item.icon}</span>
                }
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.equipNote}>
            📞 To purchase or order any equipment, please <a href="/contact">contact the club</a> directly. Our team will guide you on availability, sizing, and pricing.
          </div>
        </div>
      </div>
    </div>
  );
}
