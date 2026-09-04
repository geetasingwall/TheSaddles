import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Card } from '../../components/Cards/Card';
import { Button } from '../../components/Buttons/Button';
import { Input, Select } from '../../components/Inputs/Input';
import { fmtDate } from '../../utils/date';
import styles from './AdminStudents.module.css';

interface Student {
  id: string;
  student_number: string;
  first_name: string;
  last_name?: string;
  mobile_number: string;
  batch_id?: string;
  membership_status: string;
  joining_date: string;
  monthly_fee?: number;
  place?: string;
}

interface Payment { id: string; date: string; amount: number; mode: string; month: string; }
interface ProgressRecord { id: string; assessment_date: string; riding_level: string; performance_rating?: number; skills_learned?: string; strengths?: string; areas_for_improvement?: string; next_goals?: string; coach_remarks?: string; }
interface VideoLink { id: string; title: string; url: string; display_order: number; }
interface StudentPhoto { id: string; image_path: string; caption?: string; }

const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Other'];

export function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, 'fees' | 'progress' | 'videos' | 'photos'>>({});
  const [fees, setFees] = useState<Record<string, Payment[]>>({});
  const [progress, setProgress] = useState<Record<string, ProgressRecord[]>>({});
  const [videos, setVideos] = useState<Record<string, VideoLink[]>>({});
  const [videoForm, setVideoForm] = useState<Record<string, { title: string; url: string }>>({});
  const [savingVideo, setSavingVideo] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<string, StudentPhoto[]>>({});
  const [photoCaption, setPhotoCaption] = useState<Record<string, string>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [feeForm, setFeeForm] = useState<Record<string, { amount: string; mode: string; month: string; date: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [feeInput, setFeeInput] = useState<Record<string, string>>({});
  const [savingFee, setSavingFee] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getStudents().then(r => {
      setStudents((r.data as Student[]) || []);
    }).finally(() => setLoading(false));
  }, []);

  const loadFees = async (studentId: string) => {
    if (fees[studentId]) return;
    const r = await adminApi.getStudentFees(studentId);
    const payments = ((r.data as any[]) || []).map((p: any) => ({
      id: p.id, date: p.date, amount: p.amount, mode: p.mode, month: p.month,
    }));
    setFees(prev => ({ ...prev, [studentId]: payments }));
  };

  const loadProgress = async (studentId: string) => {
    if (progress[studentId]) return;
    const r = await adminApi.getStudentProgress(studentId);
    setProgress(prev => ({ ...prev, [studentId]: (r.data as ProgressRecord[]) || [] }));
  };

  const loadVideos = async (studentId: string) => {
    const r = await adminApi.getStudentVideos(studentId);
    setVideos(prev => ({ ...prev, [studentId]: (r.data as VideoLink[]) || [] }));
    if (!videoForm[studentId]) setVideoForm(prev => ({ ...prev, [studentId]: { title: '', url: '' } }));
  };

  const loadPhotos = async (studentId: string) => {
    const r = await adminApi.getStudentPhotos(studentId);
    setPhotos(prev => ({ ...prev, [studentId]: (r.data as StudentPhoto[]) || [] }));
  };

  const handleUploadPhoto = async (studentId: string, file: File) => {
    setUploadingPhoto(studentId);
    try {
      await adminApi.uploadStudentPhoto(studentId, file, photoCaption[studentId] || undefined);
      setPhotoCaption(prev => ({ ...prev, [studentId]: '' }));
      await loadPhotos(studentId);
    } finally {
      setUploadingPhoto(null);
    }
  };

  const handleDeletePhoto = async (studentId: string, photoId: string) => {
    await adminApi.deleteStudentPhoto(studentId, photoId);
    setPhotos(prev => ({ ...prev, [studentId]: (prev[studentId] || []).filter(p => p.id !== photoId) }));
  };

  const toggleExpand = async (id: string, currentFee?: number) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    const tab = activeTab[id] || 'fees';
    if (tab === 'fees') await loadFees(id);
    else await loadProgress(id);
    if (!feeForm[id]) {
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = today.slice(0, 7) + '-01';
      setFeeForm(prev => ({ ...prev, [id]: { amount: '', mode: 'Cash', month: thisMonth, date: today } }));
    }
    if (!feeInput[id]) setFeeInput(prev => ({ ...prev, [id]: currentFee ? String(currentFee) : '' }));
  };

  const handleAddVideo = async (studentId: string) => {
    const f = videoForm[studentId];
    if (!f?.title.trim() || !f?.url.trim()) return;
    setSavingVideo(studentId);
    try {
      await adminApi.addStudentVideo(studentId, { title: f.title, url: f.url });
      setVideoForm(prev => ({ ...prev, [studentId]: { title: '', url: '' } }));
      setVideos(prev => { const n = { ...prev }; delete n[studentId]; return n; });
      await loadVideos(studentId);
    } finally {
      setSavingVideo(null);
    }
  };

  const handleDeleteVideo = async (studentId: string, linkId: string) => {
    await adminApi.deleteStudentVideo(studentId, linkId);
    setVideos(prev => { const n = { ...prev }; delete n[studentId]; return n; });
    await loadVideos(studentId);
  };

  const handleSetMonthlyFee = async (studentId: string) => {
    const val = feeInput[studentId];
    if (!val || isNaN(Number(val))) return;
    setSavingFee(studentId);
    try {
      await adminApi.updateStudentFee(studentId, Number(val));
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, monthly_fee: Number(val) } : s));
    } finally {
      setSavingFee(null);
    }
  };

  const handleRecordPayment = async (studentId: string) => {
    const f = feeForm[studentId];
    if (!f?.amount || !f.mode || !f.month || !f.date) return;
    setSaving(studentId);
    try {
      await adminApi.recordFeePayment({
        student_id: studentId,
        payment_date: f.date,
        payment_for_month: f.month,
        amount_paid: Number(f.amount),
        payment_mode: f.mode,
      });
      setFees(prev => { const n = { ...prev }; delete n[studentId]; return n; });
      await loadFees(studentId);
      setFeeForm(prev => ({ ...prev, [studentId]: { ...prev[studentId], amount: '' } }));
      setSaved(studentId);
      setTimeout(() => setSaved(null), 2500);
    } finally {
      setSaving(null);
    }
  };

  const switchTab = async (studentId: string, tab: 'fees' | 'progress' | 'videos' | 'photos') => {
    setActiveTab(prev => ({ ...prev, [studentId]: tab }));
    if (tab === 'fees') await loadFees(studentId);
    else if (tab === 'progress') await loadProgress(studentId);
    else if (tab === 'videos') await loadVideos(studentId);
    else await loadPhotos(studentId);
  };

  if (loading) return <div className={styles.loading}>Loading students...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Students 👥</h1>
        <p>{students.length} student{students.length !== 1 ? 's' : ''} registered</p>
      </div>

      {students.length === 0 ? (
        <Card title=""><p className={styles.empty}>No students yet.</p></Card>
      ) : (
        students.map(s => {
          const isOpen = expandedId === s.id;
          const studentFees = fees[s.id] || [];
          const totalPaid = studentFees.reduce((sum, p) => sum + Number(p.amount), 0);
          const f = feeForm[s.id];
          return (
            <div key={s.id} className={styles.studentCard}>
              <div className={styles.studentRow} onClick={() => toggleExpand(s.id, s.monthly_fee)}>
                <div className={styles.studentInfo}>
                  <span className={styles.name}>{s.first_name} {s.last_name || ''}</span>
                  <span className={styles.meta}>
                    {s.student_number} · 📞 {s.mobile_number} · {s.membership_status}
                    {s.place && <> · 📍 {s.place}</>}
                    {s.monthly_fee ? <> · ₹{s.monthly_fee.toLocaleString('en-IN')}/mo</> : <> · <span style={{ color: 'var(--danger)' }}>No fee set</span></>}
                  </span>
                </div>
                <div className={styles.rowRight}>
                  {isOpen && totalPaid > 0 && (
                    <span className={styles.totalPaid}>₹{totalPaid.toLocaleString('en-IN')} paid</span>
                  )}
                  <span className={styles.toggle}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className={styles.expanded}>
                  {/* Tab switcher */}
                  <div className={styles.tabs}>
                    <button className={`${styles.tab} ${(activeTab[s.id] || 'fees') === 'fees' ? styles.tabActive : ''}`} onClick={() => switchTab(s.id, 'fees')}>💰 Fees</button>
                    <button className={`${styles.tab} ${activeTab[s.id] === 'progress' ? styles.tabActive : ''}`} onClick={() => switchTab(s.id, 'progress')}>📈 Progress</button>
                    <button className={`${styles.tab} ${activeTab[s.id] === 'videos' ? styles.tabActive : ''}`} onClick={() => switchTab(s.id, 'videos')}>🎬 Videos</button>
                    <button className={`${styles.tab} ${activeTab[s.id] === 'photos' ? styles.tabActive : ''}`} onClick={() => switchTab(s.id, 'photos')}>📸 Photos</button>
                  </div>

                  {(activeTab[s.id] || 'fees') === 'fees' && (<>
                  <div className={styles.section}>
                    <strong className={styles.sectionTitle}>Payment History</strong>
                    {studentFees.length === 0 ? (
                      <p className={styles.empty}>No payments recorded yet.</p>
                    ) : (
                      <div className={styles.payTable}>
                        <div className={styles.payHeader}>
                          <span>Date</span><span>For Month</span><span>Amount</span><span>Mode</span>
                        </div>
                        {studentFees.map(p => (
                          <div key={p.id} className={styles.payRow}>
                            <span>{fmtDate(p.date)}</span>
                            <span>{fmtDate(p.month, { month: 'short', year: 'numeric' })}</span>
                            <span className={styles.amount}>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                            <span>{p.mode}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.section}>
                    <strong className={styles.sectionTitle}>Monthly Fee</strong>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8 }}>
                      <Input
                        label="Monthly Fee ₹"
                        type="number"
                        placeholder="e.g. 3000"
                        value={feeInput[s.id] || ''}
                        onChange={e => setFeeInput(prev => ({ ...prev, [s.id]: e.target.value }))}
                      />
                      <Button size="sm" loading={savingFee === s.id} onClick={() => handleSetMonthlyFee(s.id)}>Set Fee</Button>
                    </div>
                  </div>

                  <div className={styles.section}>
                    <strong className={styles.sectionTitle}>Record Payment</strong>
                    {f && (
                      <div className={styles.payForm}>
                        <Input
                          label="Amount ₹"
                          type="number"
                          placeholder="e.g. 3000"
                          value={f.amount}
                          onChange={e => setFeeForm(prev => ({ ...prev, [s.id]: { ...prev[s.id], amount: e.target.value } }))}
                        />
                        <Select
                          label="Payment Mode"
                          options={PAYMENT_MODES.map(m => ({ value: m, label: m }))}
                          value={f.mode}
                          onChange={e => setFeeForm(prev => ({ ...prev, [s.id]: { ...prev[s.id], mode: e.target.value } }))}
                        />
                        <Input
                          label="Payment Date"
                          type="date"
                          value={f.date}
                          onChange={e => setFeeForm(prev => ({ ...prev, [s.id]: { ...prev[s.id], date: e.target.value } }))}
                        />
                        <Input
                          label="For Month"
                          type="date"
                          value={f.month}
                          onChange={e => setFeeForm(prev => ({ ...prev, [s.id]: { ...prev[s.id], month: e.target.value } }))}
                        />
                        <div className={styles.payActions}>
                          <Button size="sm" loading={saving === s.id} onClick={() => handleRecordPayment(s.id)}>
                            Record Payment
                          </Button>
                          {saved === s.id && <span className={styles.savedMsg}>✅ Saved!</span>}
                        </div>
                      </div>
                    )}
                  </div>
                  </>)}

                  {activeTab[s.id] === 'progress' && (
                    <div className={styles.section}>
                      {(progress[s.id] || []).length === 0 ? (
                        <p className={styles.empty}>No progress records yet.</p>
                      ) : (
                        (progress[s.id] || []).map(p => (
                          <div key={p.id} className={styles.progressCard}>
                            <div className={styles.progressHeader}>
                              <span className={styles.progressLevel}>{p.riding_level}</span>
                              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                {p.performance_rating && <span style={{ color: '#f5a623' }}>{'⭐'.repeat(p.performance_rating)}</span>}
                                <span className={styles.progressDate}>{fmtDate(p.assessment_date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                            </div>
                            {p.skills_learned && <div className={styles.progressField}><b>Skills:</b> {p.skills_learned}</div>}
                            {p.strengths && <div className={styles.progressField}><b>Strengths:</b> {p.strengths}</div>}
                            {p.areas_for_improvement && <div className={styles.progressField}><b>Improve:</b> {p.areas_for_improvement}</div>}
                            {p.next_goals && <div className={styles.progressField}><b>Next Goals:</b> {p.next_goals}</div>}
                            {p.coach_remarks && <div className={styles.progressRemarks}>💬 {p.coach_remarks}</div>}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab[s.id] === 'videos' && (
                    <div className={styles.section}>
                      <strong className={styles.sectionTitle}>YouTube Video Links</strong>
                      <div className={styles.videoForm}>
                        <Input
                          label="Title"
                          placeholder="e.g. Trot Technique"
                          value={videoForm[s.id]?.title || ''}
                          onChange={e => setVideoForm(prev => ({ ...prev, [s.id]: { ...prev[s.id], title: e.target.value } }))}
                        />
                        <Input
                          label="YouTube URL"
                          placeholder="https://youtube.com/watch?v=..."
                          value={videoForm[s.id]?.url || ''}
                          onChange={e => setVideoForm(prev => ({ ...prev, [s.id]: { ...prev[s.id], url: e.target.value } }))}
                        />
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <Button size="sm" loading={savingVideo === s.id} onClick={() => handleAddVideo(s.id)}>Add Video</Button>
                        </div>
                      </div>
                      {(videos[s.id] || []).length === 0 ? (
                        <p className={styles.empty}>No videos added yet.</p>
                      ) : (
                        <div className={styles.videoList}>
                          {(videos[s.id] || []).map(v => (
                            <div key={v.id} className={styles.videoRow}>
                              <a href={v.url} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                                <span>▶</span> {v.title}
                              </a>
                              <button className={styles.deleteBtn} onClick={() => handleDeleteVideo(s.id, v.id)}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab[s.id] === 'photos' && (
                    <div className={styles.section}>
                      <strong className={styles.sectionTitle}>Riding Photos</strong>
                      <div className={styles.photoUploadRow}>
                        <Input
                          label="Caption (optional)"
                          placeholder="e.g. Jumping practice"
                          value={photoCaption[s.id] || ''}
                          onChange={e => setPhotoCaption(prev => ({ ...prev, [s.id]: e.target.value }))}
                        />
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <label className={styles.uploadLabel}>
                            {uploadingPhoto === s.id ? 'Uploading...' : '⬆ Upload Photo'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={uploadingPhoto === s.id}
                              onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadPhoto(s.id, f); e.target.value = ''; }}
                            />
                          </label>
                        </div>
                      </div>
                      {(photos[s.id] || []).length === 0 ? (
                        <p className={styles.empty}>No photos uploaded yet.</p>
                      ) : (
                        <div className={styles.photoGrid}>
                          {(photos[s.id] || []).map(p => (
                            <div key={p.id} className={styles.photoCard}>
                              <img src={`/uploads/${p.image_path}`} alt={p.caption || ''} className={styles.photoThumb} />
                              {p.caption && <div className={styles.photoCaption}>{p.caption}</div>}
                              <button className={styles.photoDeleteBtn} onClick={() => handleDeletePhoto(s.id, p.id)}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
