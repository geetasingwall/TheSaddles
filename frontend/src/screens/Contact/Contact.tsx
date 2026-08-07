import { useEffect, useState } from 'react';
import { publicApi } from '../../api';
import type { ClubLocation } from '../../types';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import styles from './Contact.module.css';

export function Contact() {
  const [locations, setLocations] = useState<ClubLocation[]>([]);
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [activeLocation, setActiveLocation] = useState<ClubLocation | null>(null);

  useEffect(() => {
    publicApi.getLocations().then(r => {
      const locs = (r.data as ClubLocation[]) || [];
      setLocations(locs);
      if (locs.length > 0) setActiveLocation(locs[0]);
    });
    publicApi.getConfig().then(r => setConfig((r.data as Record<string, unknown>) || {}));
  }, []);

  const instagram = config.instagram_url ? String(config.instagram_url) : '';
  const facebook  = config.facebook_url  ? String(config.facebook_url)  : '';
  const twitter   = config.twitter_url   ? String(config.twitter_url)   : '';
  const youtube   = config.youtube_url   ? String(config.youtube_url)   : '';
  const whatsapp  = config.whatsapp_number ? `https://wa.me/${String(config.whatsapp_number)}` : '';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Visit us at one of our locations.</p>
      </div>

      {/* Info bar */}
      <div className={styles.infoBar}>
        <a href="tel:9711115694" className={styles.infoItem}>
          <Phone size={18} /><span>{config.primary_phone ? String(config.primary_phone) : '9711115694'}</span>
        </a>
        {!!config.primary_email && (
          <a href={`mailto:${String(config.primary_email)}`} className={styles.infoItem}>
            <Mail size={18} /><span>{String(config.primary_email)}</span>
          </a>
        )}
      </div>

      {/* Locations + Map */}
      <div className={styles.mapSection}>
        {/* Location selector cards */}
        <div className={styles.locationList}>
          {locations.map(loc => (
            <div
              key={loc.id}
              className={`${styles.locationCard} ${activeLocation?.id === loc.id ? styles.active : ''}`}
              onClick={() => setActiveLocation(loc)}
            >
              <h2><MapPin size={18} /> {loc.branch_name}</h2>
              <p className={styles.address}>{loc.address_line_1}</p>
              <p className={styles.city}>{loc.city}, {loc.state}</p>
              {loc.contact_number && (
                <p className={styles.phone}><Phone size={14} /> {loc.contact_number}</p>
              )}
              {loc.latitude && loc.longitude && (
                <a
                  href={`https://maps.google.com/?q=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                  onClick={e => e.stopPropagation()}
                >
                  Open in Google Maps ↗
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Embedded map */}
        <div className={styles.mapEmbed}>
          {activeLocation?.latitude && activeLocation?.longitude ? (
            <iframe
              key={activeLocation.id}
              title={activeLocation.branch_name}
              src={`https://maps.google.com/maps?q=${activeLocation.latitude},${activeLocation.longitude}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 'var(--radius)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className={styles.noMap}>
              <MapPin size={40} />
              <p>No map coordinates available for this location.</p>
            </div>
          )}
        </div>
      </div>

      {/* Social Media */}
      <div className={styles.social}>
        <h2>Follow Us</h2>
        <div className={styles.socialLinks}>
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <Instagram size={22} /> Instagram
            </a>
          )}
          {facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <Facebook size={22} /> Facebook
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <Twitter size={22} /> Twitter / X
            </a>
          )}
          {youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <span style={{ fontSize: '1.2rem' }}>▶</span> YouTube
            </a>
          )}
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${styles.socialBtn} ${styles.whatsappBtn}`}>
              <span style={{ fontSize: '1.1rem' }}>💬</span> WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2>Ready to Ride?</h2>
        <p>Book a trial session and experience the joy of horse riding.</p>
        <a href="/trial-booking" className={styles.ctaBtn}>Book Trial Ride</a>
      </div>
    </div>
  );
}
