import { useEffect, useState } from 'react';
import { publicApi } from '../../api';
import type { Horse } from '../../types';
import styles from './Horses.module.css';

interface HorseDetail extends Horse {
  name?: string;  // API returns 'name' for stable_name in detail response
  registered_name?: string;
  gender?: string;
  color?: string;
  notes?: string;
  gallery_images?: string[];
}

export function Horses() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<HorseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [cacheBust] = useState(Date.now());

  useEffect(() => {
    publicApi.getHorses().then(r => setHorses((r.data as Horse[]) || [])).finally(() => setLoading(false));
  }, []);

  const openDetail = async (horse: Horse) => {
    setDetailLoading(true);
    setActiveImg(0);
    try {
      const r = await publicApi.getHorseDetail(horse.id);
      setSelected(r.data as HorseDetail);
    } finally {
      setDetailLoading(false);
    }
  };

  const allImages = selected ? [
    ...(selected.image_path ? [`/uploads/${selected.image_path}`] : []),
    ...(selected.gallery_images || []).map(p => `/uploads/${p}`),
  ] : [];

  if (loading) return <div className={styles.loading}>Loading horses...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Our Horses</h1>
        <p>Meet the wonderful horses that make our club special.</p>
      </div>
      <div className={styles.grid}>
        {horses.map(h => (
          <div key={h.id} className={styles.card} onClick={() => openDetail(h)}>
            {h.image_path
              ? <div className={styles.imgWrapper}>
                  <img src={`/uploads/${h.image_path}?v=${cacheBust}`} alt="" className={styles.imgBg} />
                  <img src={`/uploads/${h.image_path}?v=${cacheBust}`} alt={h.stable_name} className={styles.img} />
                </div>
              : <div className={styles.placeholder}>🐴</div>
            }
            <div className={styles.body}>
              <h3>{h.stable_name}</h3>
              <div className={styles.tags}>
                {h.breed && <span className={styles.tag}>{h.breed}</span>}
                {h.training_level && <span className={styles.tag}>{h.training_level}</span>}
              </div>
              <div className={styles.badges}>
                {h.available_for_lease && (h.lease_events as string) !== 'BOOKED' && (
                  <span className={styles.leaseAvailBadge}>Available for Lease</span>
                )}
                {(h.lease_events as string) === 'BOOKED' && (
                  <span className={styles.bookedBadge}>Booked</span>
                )}
              </div>
              <span className={styles.viewMore}>View details →</span>
            </div>
          </div>
        ))}
      </div>
      {horses.length === 0 && <p className={styles.empty}>No horses listed yet.</p>}

      {/* Detail Modal */}
      {(selected || detailLoading) && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            {detailLoading ? (
              <div className={styles.modalLoading}>Loading...</div>
            ) : selected && (
              <>
                {/* Gallery */}
                {allImages.length > 0 && (
                  <div className={styles.gallery}>
                    <div className={styles.mainImgWrapper}>
                      <img src={allImages[activeImg]} alt="" className={styles.mainImgBg} />
                      <img src={allImages[activeImg]} alt={selected.stable_name} className={styles.mainImg} />
                    </div>
                    {allImages.length > 1 && (
                      <div className={styles.thumbs}>
                        {allImages.map((src, i) => (
                          <img key={i} src={src} alt="" className={`${styles.thumb} ${i === activeImg ? styles.activeThumb : ''}`}
                            onClick={() => setActiveImg(i)} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {allImages.length === 0 && <div className={styles.modalPlaceholder}>🐴</div>}

                <div className={styles.modalBody}>
                  <h2>{selected.stable_name || selected.name}</h2>
                  {selected.registered_name && <p className={styles.regName}>{selected.registered_name}</p>}
                  <div className={styles.tags}>
                    {selected.breed && <span className={styles.tag}>{selected.breed}</span>}
                    {selected.color && <span className={styles.tag}>{selected.color}</span>}
                    {selected.gender && <span className={styles.tag}>{selected.gender}</span>}
                    {selected.training_level && <span className={styles.tag}>Level: {selected.training_level}</span>}
                  </div>
                  <div className={styles.badges}>
                    {selected.available_for_lease && selected.lease_events && (selected.lease_events as string) !== 'BOOKED' && (
                      (selected.lease_events as string).split(',').map(ev => ev.trim()).filter(Boolean).map(ev => (
                        <span key={ev} className={styles.leaseBadge}>{ev}</span>
                      ))
                    )}
                  </div>
                  {selected.notes && <p className={styles.notes}>{selected.notes}</p>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
