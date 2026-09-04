import { useEffect, useState } from 'react';
import { galleryApi } from '../../api';
import styles from './Gallery.module.css';

interface GalleryPhoto {
  id: string;
  image_path: string;
  caption?: string;
  student_name?: string;
}

export function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    galleryApi.getAll().then(r => setPhotos((r.data as GalleryPhoto[]) || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading gallery...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Our Riders in Action 🐴</h1>
        <p>Moments captured from our training sessions and events</p>
      </div>

      {photos.length === 0 ? (
        <div className={styles.empty}>No photos yet. Check back soon!</div>
      ) : (
        <div className={styles.grid}>
          {photos.map(p => (
            <div key={p.id} className={styles.card} onClick={() => setLightbox(p)}>
              <img src={`/uploads/${p.image_path}`} alt={p.caption || 'Riding photo'} className={styles.img} />
              {(p.caption || p.student_name) && (
                <div className={styles.overlay}>
                  {p.student_name && <span className={styles.name}>{p.student_name}</span>}
                  {p.caption && <span className={styles.caption}>{p.caption}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className={styles.lightboxBg} onClick={() => setLightbox(null)}>
          <div className={styles.lightbox} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setLightbox(null)}>✕</button>
            <img src={`/uploads/${lightbox.image_path}`} alt={lightbox.caption || ''} className={styles.lightboxImg} />
            {(lightbox.caption || lightbox.student_name) && (
              <div className={styles.lightboxMeta}>
                {lightbox.student_name && <span className={styles.lightboxName}>{lightbox.student_name}</span>}
                {lightbox.caption && <span className={styles.lightboxCaption}>{lightbox.caption}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
