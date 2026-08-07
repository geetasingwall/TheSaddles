import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { fmtDate } from '../../utils/date';
import { Card, StatCard } from '../../components/Cards/Card';
import { Button } from '../../components/Buttons/Button';
import { Input, Select } from '../../components/Inputs/Input';
import { useStore } from '../../store';
import type { AdminDashboard, Registration, TrialBooking, Horse } from '../../types';
import { Users, Calendar, UserCheck } from 'lucide-react';
import styles from './AdminDashboard.module.css';

interface Coach { id: string; first_name: string; last_name?: string; mobile_number: string; experience_years?: number; specialization?: string; assigned_place?: string; is_active: boolean; }
interface Batch { id: string; batch_name: string; coach_id: string; training_day: string; start_time: string; end_time: string; is_active: boolean; }

export function AdminDashboard() {
  const { user } = useStore();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [pendingRegs, setPendingRegs] = useState<Registration[]>([]);
  const [bookings, setBookings] = useState<TrialBooking[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [approveReg, setApproveReg] = useState<Registration | null>(null);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [approving, setApproving] = useState(false);

  const [showCoachForm, setShowCoachForm] = useState(false);
  const [coachForm, setCoachForm] = useState({ first_name: '', last_name: '', mobile_number: '', experience_years: '', assigned_place: '', batch_ids: [] as string[] });
  const [savingCoach, setSavingCoach] = useState(false);

  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchForm, setBatchForm] = useState({ batch_name: '', coach_id: '', training_days: [] as string[], start_time: '', end_time: '' });
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchError, setBatchError] = useState('');

  const [horses, setHorses] = useState<Horse[]>([]);
  const [showHorseForm, setShowHorseForm] = useState(false);
  const [horseForm, setHorseForm] = useState({ stable_name: '', breed: '', color: '', gender: '', training_level: '', available_for_lease: false, lease_events: [] as string[] });
  const [savingHorse, setSavingHorse] = useState(false);
  const [horseError, setHorseError] = useState('');
  const [uploadingHorseId, setUploadingHorseId] = useState<string | null>(null);
  const [uploadingGalleryId, setUploadingGalleryId] = useState<string | null>(null);
  const [leaseEventOptions, setLeaseEventOptions] = useState<string[]>(['Show Jumping', 'Polo', 'Hacks', 'Dressage', 'Cross Country']);
  const [expandedHorseId, setExpandedHorseId] = useState<string | null>(null);
  const [imgCacheBust, setImgCacheBust] = useState(Date.now());

  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editingDays, setEditingDays] = useState<string[]>([]);
  const [editingCoachId, setEditingCoachId] = useState<string>('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [editingLeaseHorseId, setEditingLeaseHorseId] = useState<string | null>(null);
  const [editingLeaseEvents, setEditingLeaseEvents] = useState<string[]>([]);

  const loadData = () => {
    Promise.allSettled([
      adminApi.getDashboard(),
      adminApi.getRegistrations('Pending'),
      adminApi.getTrialBookings(),
      adminApi.getCoaches(),
      adminApi.getBatches(),
      adminApi.getStudents(),
      adminApi.getAttendance(),
      adminApi.getHorses(),
    ]).then(([d, r, b, c, bt, s, att, h]) => {
      if (d.status === 'fulfilled') setDashboard(d.value.data as AdminDashboard);
      if (r.status === 'fulfilled') setPendingRegs((r.value.data as Registration[]) || []);
      if (b.status === 'fulfilled') setBookings((b.value.data as TrialBooking[]) || []);
      if (c.status === 'fulfilled') setCoaches((c.value.data as Coach[]) || []);
      if (bt.status === 'fulfilled') setBatches((bt.value.data as Batch[]) || []);
      if (s.status === 'fulfilled') setAllStudents((s.value.data as any[]) || []);
      if (att.status === 'fulfilled') setAttendance((att.value.data as any[]) || []);
      if (h.status === 'fulfilled') setHorses((h.value.data as Horse[]) || []);
    }).finally(() => setLoading(false));
    adminApi.getConfiguration().then(r => {
      const configs = (r.data as any[]) || [];
      const row = configs.find((c: any) => c.category === 'HORSES' && c.key === 'LEASE_EVENTS');
      if (row?.json_value && Array.isArray(row.json_value)) setLeaseEventOptions(row.json_value as string[]);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async () => {
    if (!approveReg || !user?.user_id) return;
    setApproving(true);
    try {
      await adminApi.approveRegistration(approveReg.id, user.user_id, {
        batch_id: selectedBatch || undefined,
        monthly_fee: monthlyFee ? Number(monthlyFee) : undefined,
      });
      setApproveReg(null);
      setSelectedBatch('');
      setMonthlyFee('');
      loadData();
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (regId: string) => {
    if (!user?.user_id) return;
    await adminApi.rejectRegistration(regId, user.user_id);
    loadData();
  };

  const handleAddCoach = async () => {
    if (!coachForm.first_name || !coachForm.mobile_number) return;
    setSavingCoach(true);
    try {
      const res = await adminApi.createCoach({
        first_name: coachForm.first_name,
        last_name: coachForm.last_name || undefined,
        mobile_number: coachForm.mobile_number,
        experience_years: coachForm.experience_years ? Number(coachForm.experience_years) : undefined,
        assigned_place: coachForm.assigned_place || undefined,
      });
      const newCoachId = (res.data as any)?.id;
      if (newCoachId && coachForm.batch_ids.length > 0) {
        await Promise.all(coachForm.batch_ids.map(bid => adminApi.updateBatch(bid, { coach_id: newCoachId })));
      }
      setCoachForm({ first_name: '', last_name: '', mobile_number: '', experience_years: '', assigned_place: '', batch_ids: [] });
      setShowCoachForm(false);
      loadData();
    } finally {
      setSavingCoach(false);
    }
  };

  const handleDeleteCoach = async (coachId: string) => {
    if (!window.confirm('Deactivate coach? They will no longer appear in the system.')) return;
    await adminApi.deleteCoach(coachId);
    loadData();
  };

  const handleAddBatch = async () => {
    if (!batchForm.batch_name || !batchForm.coach_id || batchForm.training_days.length === 0 || !batchForm.start_time || !batchForm.end_time) {
      setBatchError('All fields are required. Select at least one training day.');
      return;
    }
    setBatchError('');
    setSavingBatch(true);
    try {
      await adminApi.createBatch({
        batch_name: batchForm.batch_name,
        coach_id: batchForm.coach_id,
        training_day: batchForm.training_days.join(','),
        start_time: batchForm.start_time,
        end_time: batchForm.end_time,
      });
      setBatchForm({ batch_name: '', coach_id: '', training_days: [], start_time: '', end_time: '' });
      setShowBatchForm(false);
      loadData();
    } finally {
      setSavingBatch(false);
    }
  };

  const handleSaveBatchDays = async (batchId: string) => {
    if (editingDays.length === 0) return;
    await adminApi.updateBatch(batchId, { training_day: editingDays.join(','), coach_id: editingCoachId || undefined });
    setEditingBatchId(null);
    loadData();
  };

  const handleAddHorse = async () => {
    if (!horseForm.stable_name) return;
    setSavingHorse(true);
    setHorseError('');
    try {
      const res = await adminApi.createHorse({
        stable_name: horseForm.stable_name,
        breed: horseForm.breed || undefined,
        color: horseForm.color || undefined,
        gender: horseForm.gender || undefined,
        training_level: horseForm.training_level || undefined,
        available_for_lease: horseForm.available_for_lease,
        lease_events: horseForm.lease_events.length > 0 ? horseForm.lease_events.join(',') : undefined,
      });
      if (!res.success) { setHorseError(res.message || 'Failed to save horse'); return; }
      setHorseForm({ stable_name: '', breed: '', color: '', gender: '', training_level: '', available_for_lease: false, lease_events: [] });
      setShowHorseForm(false);
      loadData();
    } catch (e: any) {
      setHorseError(e?.response?.data?.message || 'Failed to save horse');
    } finally { setSavingHorse(false); }
  };

  const handleToggleHorse = async (horse: Horse) => {
    await adminApi.updateHorse(horse.id, { is_active: !horse.is_active });
    loadData();
  };

  const handleCoverUpload = async (horseId: string, file: File) => {
    setUploadingHorseId(horseId);
    try { await adminApi.uploadHorseImage(horseId, file); setImgCacheBust(Date.now()); loadData(); }
    finally { setUploadingHorseId(null); }
  };

  const handleGalleryUpload = async (horseId: string, file: File) => {
    setUploadingGalleryId(horseId);
    try { await adminApi.uploadHorseGallery(horseId, file); loadData(); }
    finally { setUploadingGalleryId(null); }
  };

  const handleDeleteGalleryPhoto = async (horseId: string, index: number) => {
    await adminApi.deleteHorseGalleryPhoto(horseId, index);
    loadData();
  };

  const coachName = (id: string) => {
    const c = coaches.find(c => c.id === id);
    return c ? `${c.first_name} ${c.last_name || ''}`.trim() : 'Unknown';
  };

  const shortDays = (days: string) =>
    days.split(',').map(d => d.trim().slice(0, 3)).join(', ');

  // Build per-student attendance summary from day-wise log
  const studentAttendance = (() => {
    const map: Record<string, { name: string; student_number: string; coach_name: string; days: { date: string; status: string }[] }> = {};
    attendance.forEach((day: any) => {
      day.records.forEach((r: any) => {
        if (!map[r.student_id]) map[r.student_id] = { name: r.name, student_number: r.student_number, coach_name: r.coach_name || '—', days: [] };
        map[r.student_id].days.push({ date: day.date, status: r.status });
      });
    });
    return Object.entries(map).map(([id, v]) => ({ student_id: id, ...v }));
  })();

  const unassignedStudents = allStudents.filter((s: any) => !s.batch_id);

  if (loading) return <div className={styles.loading}>Loading admin dashboard...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Admin Dashboard ⚙️</h1>
        <p>Welcome, {user?.name || 'Administrator'}</p>
      </div>

      {dashboard && (
        <div className={styles.stats}>
          <StatCard label="Total Students" value={dashboard.total_students} icon={<Users size={28} />} />
          <StatCard label="Active Students" value={dashboard.active_students} icon={<UserCheck size={28} />} />
          <StatCard label="Pending Registrations" value={dashboard.pending_registrations} icon={<Calendar size={28} />} />
          <StatCard label="Trial Bookings" value={dashboard.total_bookings} icon={<Calendar size={28} />} />
          <StatCard label="Total Horses" value={dashboard.total_horses} icon={<span>🐴</span>} />
          <StatCard label="Active Coaches" value={dashboard.active_coaches} icon={<Users size={28} />} />
        </div>
      )}

      {/* Pending Registrations */}
      <Card title={`Pending Registrations (${pendingRegs.length})`}>
        {pendingRegs.length === 0 ? (
          <p className={styles.empty}>No pending registrations.</p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader5}>
              <span>Name</span><span>Mobile</span><span>City</span><span>Date</span><span>Actions</span>
            </div>
            {pendingRegs.map(r => (
              <div key={r.id} className={styles.tableRow5}>
                <span>{r.first_name} {r.last_name || ''}</span>
                <span>{r.mobile_number}</span>
                <span>{r.city || '—'}</span>
                <span>{fmtDate(r.created_at)}</span>
                <div className={styles.actions}>
                  <Button size="sm" onClick={() => setApproveReg(r)}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => handleReject(r.id)}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Approve Modal */}
      {approveReg && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Approve Registration</h3>
            <p className={styles.modalName}>{approveReg.first_name} {approveReg.last_name || ''} — {approveReg.mobile_number}</p>
            <Select
              label="Assign to Batch (optional)"
              options={batches.map(b => ({ value: b.id, label: `${b.batch_name} — ${b.training_day} (${coachName(b.coach_id)})` }))}
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
            />
            <Input
              label="Monthly Fee ₹ (optional)"
              type="number"
              placeholder="e.g. 3000"
              value={monthlyFee}
              onChange={e => setMonthlyFee(e.target.value)}
            />
            <div className={styles.modalActions}>
              <Button onClick={handleApprove} loading={approving}>Confirm Approve</Button>
              <Button variant="secondary" onClick={() => setApproveReg(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Coaches */}
      <Card title={`Coaches (${coaches.length})`}>
        <div className={styles.table}>
          {coaches.length > 0 && (
            <>
              <div className={styles.tableHeader4}>
                <span>Name</span><span>Mobile</span><span>Place</span><span>Status</span>
              </div>
              {coaches.map(c => (
                <div key={c.id} className={styles.tableRow4}>
                  <span>{c.first_name} {c.last_name || ''}</span>
                  <span>{c.mobile_number}</span>
                  <span>{c.assigned_place || '—'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                    <span>{c.is_active ? '✅ Active' : '❌ Inactive'}</span>
                    <button type="button" onClick={() => handleDeleteCoach(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1rem', marginLeft: 'auto' }} title="Deactivate">🗑</button>
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
        {!showCoachForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowCoachForm(true)} style={{ marginTop: 12 }}>+ Add Coach</Button>
        ) : (
          <div className={styles.inlineForm}>
            <Input placeholder="First Name *" value={coachForm.first_name} onChange={e => setCoachForm(p => ({ ...p, first_name: e.target.value }))} />
            <Input placeholder="Last Name" value={coachForm.last_name} onChange={e => setCoachForm(p => ({ ...p, last_name: e.target.value }))} />
            <Input placeholder="Mobile Number *" value={coachForm.mobile_number} onChange={e => setCoachForm(p => ({ ...p, mobile_number: e.target.value }))} />
            <Input placeholder="Experience (years)" type="number" value={coachForm.experience_years} onChange={e => setCoachForm(p => ({ ...p, experience_years: e.target.value }))} />
            <Select
              label="Assigned Place (for trial bookings)"
              options={[{ value: 'Noida', label: 'Noida' }, { value: 'New Delhi', label: 'New Delhi' }]}
              value={coachForm.assigned_place}
              onChange={e => setCoachForm(p => ({ ...p, assigned_place: e.target.value }))}
            />
            {batches.length > 0 && (
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Assign Existing Batches (optional)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {batches.map(b => (
                    <label key={b.id} className={styles.dayCheck}>
                      <input
                        type="checkbox"
                        checked={coachForm.batch_ids.includes(b.id)}
                        onChange={e => setCoachForm(p => ({
                          ...p,
                          batch_ids: e.target.checked ? [...p.batch_ids, b.id] : p.batch_ids.filter(id => id !== b.id)
                        }))}
                      />
                      {b.batch_name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.actions}>
              <Button size="sm" onClick={handleAddCoach} loading={savingCoach}>Save Coach</Button>
              <Button size="sm" variant="secondary" onClick={() => setShowCoachForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Batches */}
      <Card title={`Batches (${batches.length})`}>
        <div className={styles.table}>
          {batches.map(b => {
            const batchStudents = allStudents.filter((s: any) => s.batch_id === b.id);
            const unassigned = allStudents.filter((s: any) => !s.batch_id);
            return (
              <div key={b.id} className={styles.batchBlock}>
                <div className={styles.batchHeader}>
                  <strong>{b.batch_name}</strong>
                  <span>{coachName(b.coach_id)}</span>
                  <span>{shortDays(b.training_day)}</span>
                  <span>{b.start_time} – {b.end_time}</span>
                  <button type="button" onClick={() => { setEditingBatchId(b.id); setEditingDays(b.training_day.split(',')); setEditingCoachId(b.coach_id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--primary)' }}>✏️ Edit</button>
                  <button type="button" onClick={async () => { if (!window.confirm(`Delete batch "${b.batch_name}"?`)) return; await adminApi.deleteBatch(b.id); loadData(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1rem' }} title="Delete batch">🗑</button>
                </div>
                {editingBatchId === b.id && (
                  <div style={{ padding: '8px 16px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                      <label key={day} className={styles.dayCheck}>
                        <input type="checkbox" checked={editingDays.includes(day)}
                          onChange={e => setEditingDays(p => e.target.checked ? [...p, day] : p.filter(d => d !== day))}
                        />{day.slice(0, 3)}
                      </label>
                    ))}
                    <select
                      value={editingCoachId}
                      onChange={e => setEditingCoachId(e.target.value)}
                      style={{ fontSize: '0.85rem', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                    >
                      {coaches.filter(c => c.is_active).map(c => (
                        <option key={c.id} value={c.id}>{c.first_name} {c.last_name || ''}</option>
                      ))}
                    </select>
                    <Button size="sm" onClick={() => handleSaveBatchDays(b.id)}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingBatchId(null)}>Cancel</Button>
                  </div>
                )}
                <div className={styles.batchStudents}>
                  {batchStudents.length === 0 ? (
                    <span className={styles.noStudents}>No students assigned</span>
                  ) : (
                    batchStudents.map((s: any) => (
                      <div key={s.id} className={styles.studentChip}>
                        {s.student_number} — {s.first_name} {s.last_name || ''}
                        <button type="button" className={styles.chipRemove} title="Remove from batch"
                          onClick={async () => { await adminApi.assignStudentBatch(s.id, ''); loadData(); }}
                        >✕</button>
                      </div>
                    ))
                  )}
                  {unassigned.length > 0 && (
                    <select className={styles.assignSelect} defaultValue=""
                      onChange={async e => { if (!e.target.value) return; await adminApi.assignStudentBatch(e.target.value, b.id); loadData(); }}
                    >
                      <option value="">+ Assign student…</option>
                      {unassigned.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.student_number} — {s.first_name} {s.last_name || ''}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unassigned students panel */}
        {unassignedStudents.length > 0 && batches.length > 0 && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unassigned Students ({unassignedStudents.length})</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {unassignedStudents.map((s: any) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 12px', fontSize: '0.85rem' }}>
                  <span>{s.student_number} — {s.first_name} {s.last_name || ''}</span>
                  <select style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--primary)' }}
                    defaultValue=""
                    onChange={async e => { if (!e.target.value) return; await adminApi.assignStudentBatch(s.id, e.target.value); loadData(); }}
                  >
                    <option value="">Assign batch…</option>
                    {batches.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.batch_name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {coaches.length === 0 ? (
          <p className={styles.empty} style={{ marginTop: 12 }}>Add a coach first before creating batches.</p>
        ) : !showBatchForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowBatchForm(true)} style={{ marginTop: 12 }}>+ Add Batch</Button>
        ) : (
          <div className={styles.batchForm}>
            <div className={styles.batchFormName}>
              <Input placeholder="Batch Name *" value={batchForm.batch_name} onChange={e => setBatchForm(p => ({ ...p, batch_name: e.target.value }))} />
            </div>
            <div className={styles.batchFormCoach}>
              <Select
                label="Coach *"
                options={coaches.map(c => ({ value: c.id, label: `${c.first_name} ${c.last_name || ''}`.trim() }))}
                value={batchForm.coach_id}
                onChange={e => setBatchForm(p => ({ ...p, coach_id: e.target.value }))}
              />
            </div>
            <div className={styles.batchFormTime}>
              <Input label="Start *" type="time" value={batchForm.start_time} onChange={e => setBatchForm(p => ({ ...p, start_time: e.target.value }))} />
            </div>
            <div className={styles.batchFormTime}>
              <Input label="End *" type="time" value={batchForm.end_time} onChange={e => setBatchForm(p => ({ ...p, end_time: e.target.value }))} />
            </div>
            <div className={styles.batchFormDays}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((short, i) => {
                const full = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i];
                return (
                  <label key={full} className={styles.dayCheck}>
                    <input type="checkbox" checked={batchForm.training_days.includes(full)}
                      onChange={e => setBatchForm(p => ({
                        ...p,
                        training_days: e.target.checked ? [...p.training_days, full] : p.training_days.filter(d => d !== full)
                      }))}
                    />
                    {short}
                  </label>
                );
              })}
            </div>
            <div className={styles.batchFormActions}>
              <Button size="sm" onClick={handleAddBatch} loading={savingBatch}>Save</Button>
              <Button size="sm" variant="secondary" onClick={() => { setShowBatchForm(false); setBatchError(''); }}>Cancel</Button>
            </div>
            {batchError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', margin: 0, alignSelf: 'center' }}>{batchError}</p>}
          </div>
        )}
      </Card>

      {/* Horses */}
      <Card title={`Horses (${horses.length})`}>
        <div className={styles.table}>
          {horses.map(h => {
            const isExpanded = expandedHorseId === h.id;
            const gallery: string[] = (h as any).gallery_images || [];
            return (
              <div key={h.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {h.image_path
                    ? <img src={`/uploads/${h.image_path}?v=${imgCacheBust}`} alt={h.stable_name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    : <div style={{ width: 52, height: 52, borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>🐴</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.stable_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {[h.breed, h.color, h.training_level].filter(Boolean).join(' · ')}
                      {h.available_for_lease && h.lease_events && (
                        <span style={{ marginLeft: 6, color: 'var(--primary)', fontWeight: 600 }}>· Lease: {h.lease_events}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {/* Cover photo */}
                    <label style={{ fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary)' }} title="Upload cover photo">
                      {uploadingHorseId === h.id ? '⏳' : '🖼️'}
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverUpload(h.id, f); e.target.value = ''; }} />
                    </label>
                    {/* Gallery photo */}
                    <label style={{ fontSize: '0.78rem', cursor: 'pointer', color: 'var(--accent)' }} title="Add gallery photo">
                      {uploadingGalleryId === h.id ? '⏳' : '📷'}
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleGalleryUpload(h.id, f); e.target.value = ''; }} />
                    </label>
                    {gallery.length > 0 && (
                      <button type="button" onClick={() => setExpandedHorseId(isExpanded ? null : h.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--primary)' }}>
                        {isExpanded ? '▲' : `▼ ${gallery.length} photo${gallery.length > 1 ? 's' : ''}`}
                      </button>
                    )}
                    <button type="button" onClick={() => handleToggleHorse(h)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                      title={h.is_active ? 'Deactivate' : 'Activate'}>
                      {h.is_active ? '✅' : '❌'}
                    </button>
                    {h.is_active && (
                      <select
                        value={
                          h.available_for_lease && (h.lease_events as string) !== 'BOOKED' ? 'available'
                          : (h.lease_events as string) === 'BOOKED' ? 'booked'
                          : 'not_for_lease'
                        }
                        onChange={e => {
                          const v = e.target.value;
                          if (v === 'available') {
                            // open inline discipline picker
                            setEditingLeaseHorseId(h.id);
                            setEditingLeaseEvents([]);
                          } else {
                            adminApi.updateHorse(h.id, {
                              available_for_lease: false,
                              lease_events: v === 'booked' ? 'BOOKED' : '',
                            }).then(loadData);
                          }
                        }}
                        style={{
                          fontSize: '0.75rem', padding: '3px 6px', borderRadius: 6,
                          border: '1px solid var(--border)', cursor: 'pointer',
                          background:
                            h.available_for_lease && (h.lease_events as string) !== 'BOOKED' ? '#e8f5e9'
                            : (h.lease_events as string) === 'BOOKED' ? '#fff3e0'
                            : '#fce4ec',
                          color:
                            h.available_for_lease && (h.lease_events as string) !== 'BOOKED' ? 'var(--primary)'
                            : (h.lease_events as string) === 'BOOKED' ? '#e65100'
                            : '#8b0000',
                          fontWeight: 600,
                        }}
                      >
                        <option value="available">🟢 For Lease</option>
                        <option value="booked">🟠 Booked</option>
                        <option value="not_for_lease">🔴 Not for Lease</option>
                      </select>
                    )}
                  </div>
                </div>
                {isExpanded && gallery.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, paddingLeft: 64 }}>
                    {gallery.map((p, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={`/uploads/${p}`} alt="" style={{ width: 80, height: 64, objectFit: 'cover', borderRadius: 6 }} />
                        <button type="button"
                          onClick={() => handleDeleteGalleryPhoto(h.id, i)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: '0.65rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete photo">✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {editingLeaseHorseId === h.id && (
                  <div style={{ marginTop: 10, paddingLeft: 64, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%' }}>Select disciplines for lease:</span>
                    {leaseEventOptions.map(ev => (
                      <label key={ev} className={styles.dayCheck}>
                        <input type="checkbox" checked={editingLeaseEvents.includes(ev)}
                          onChange={e => setEditingLeaseEvents(p => e.target.checked ? [...p, ev] : p.filter(x => x !== ev))}
                        />{ev}
                      </label>
                    ))}
                    <Button size="sm" onClick={() => {
                      adminApi.updateHorse(h.id, {
                        available_for_lease: true,
                        lease_events: editingLeaseEvents.join(','),
                      }).then(() => { setEditingLeaseHorseId(null); loadData(); });
                    }}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingLeaseHorseId(null)}>Cancel</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!showHorseForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowHorseForm(true)} style={{ marginTop: 12 }}>+ Add Horse</Button>
        ) : (
          <div className={styles.inlineForm}>
            <Input placeholder="Stable Name *" value={horseForm.stable_name} onChange={e => setHorseForm(p => ({ ...p, stable_name: e.target.value }))} />
            <Input placeholder="Breed" value={horseForm.breed} onChange={e => setHorseForm(p => ({ ...p, breed: e.target.value }))} />
            <Input placeholder="Color" value={horseForm.color} onChange={e => setHorseForm(p => ({ ...p, color: e.target.value }))} />
            <div className={styles.horseInlineRow}>
              <select className={styles.horseSelect} value={horseForm.gender} onChange={e => setHorseForm(p => ({ ...p, gender: e.target.value }))}>
                <option value="">Gender</option>
                <option>Male</option><option>Female</option>
              </select>
              <select className={styles.horseSelect} value={horseForm.training_level} onChange={e => setHorseForm(p => ({ ...p, training_level: e.target.value }))}>
                <option value="">Level</option>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div className={styles.horseInlineRow}>
              <label className={styles.horseCheckLabel}>
                <input type="checkbox" checked={horseForm.available_for_lease}
                  onChange={e => setHorseForm(p => ({ ...p, available_for_lease: e.target.checked, lease_events: e.target.checked ? p.lease_events : [] }))}
                />
                Available for Lease
              </label>
            </div>
            {horseForm.available_for_lease && (
              <div className={styles.fullCol}>
                <label className={styles.daysLabel}>Lease Events</label>
                <div className={styles.dayCheckboxes}>
                  {leaseEventOptions.map(ev => (
                    <label key={ev} className={styles.dayCheck}>
                      <input type="checkbox" checked={horseForm.lease_events.includes(ev)}
                        onChange={e => setHorseForm(p => ({
                          ...p,
                          lease_events: e.target.checked ? [...p.lease_events, ev] : p.lease_events.filter(x => x !== ev)
                        }))}
                      />
                      {ev}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.actions}>
              <Button size="sm" onClick={handleAddHorse} loading={savingHorse}>Save Horse</Button>
              <Button size="sm" variant="secondary" onClick={() => { setShowHorseForm(false); setHorseError(''); }}>Cancel</Button>
            </div>
            {horseError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', gridColumn: '1/-1', margin: 0 }}>{horseError}</p>}
          </div>
        )}
      </Card>

      {/* Attendance Overview */}
      <Card title={`Attendance (${studentAttendance.length} students)`}>
        {studentAttendance.length === 0 ? (
          <p className={styles.empty}>No attendance records yet.</p>
        ) : (
          studentAttendance.map(s => {
            const isExpanded = expandedStudent === s.student_id;
            const present = s.days.filter(d => d.status === 'Present').length;
            const total = s.days.length;
            const visibleDays = isExpanded ? s.days : s.days.slice(0, 5);
            return (
              <div key={s.student_id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setExpandedStudent(isExpanded ? null : s.student_id)}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>{s.student_number} &nbsp;·&nbsp; Coach: {s.coach_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>{present}P</span>
                      &nbsp;/&nbsp;
                      <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{total - present}A</span>
                      &nbsp;of {total}
                    </span>
                    <button type="button" onClick={e => { e.stopPropagation(); if (!window.confirm(`Deactivate ${s.name}?`)) return; adminApi.deleteStudent(s.student_id).then(loadData); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1rem' }} title="Deactivate">🗑</button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{isExpanded ? '▲ Hide' : '▼ Show'}</span>
                  </div>
                </div>
                {(isExpanded || total <= 5) && (
                  <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {visibleDays.map(d => (
                      <span key={d.date} style={{
                        fontSize: '0.75rem', padding: '2px 8px', borderRadius: 10,
                        background: d.status === 'Present' ? 'var(--success)' : 'var(--danger)',
                        color: '#fff', opacity: 0.85
                      }}>
                        {fmtDate(d.date, { day: 'numeric', month: 'short' })} · {d.status === 'Present' ? 'P' : 'A'}
                      </span>
                    ))}
                    {!isExpanded && total > 5 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', padding: '2px 4px' }}
                        onClick={() => setExpandedStudent(s.student_id)}>+{total - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </Card>

      {/* Trial Bookings */}
      <Card title={`Trial Bookings (${bookings.length})`}>
        {bookings.length === 0 ? (
          <p className={styles.empty}>No trial bookings yet.</p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader8}>
              <span>Name</span><span>Mobile</span><span>Date</span><span>Slot</span><span>Place</span><span>Riders</span><span>Coach</span><span>Status</span>
            </div>
            {bookings.map(b => (
              <div key={b.id} className={styles.tableRow8}>
                <span>{b.full_name}</span>
                <span>{b.mobile_number}</span>
                <span>{fmtDate(b.booking_date)}</span>
                <span>{b.start_time} – {b.end_time}</span>
                <span>{(b as any).place}</span>
                <span>{b.number_of_participants}</span>
                <span>{(b as any).coach_name || '—'}</span>
                <span>{b.booking_status}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className={styles.quickLinks}>
        <h3>Quick Navigation</h3>
        <div className={styles.linkGrid}>
          {[
            { label: '📋 All Registrations', href: '/admin/registrations' },
            { label: '👥 Students', href: '/admin/students' },
            { label: '🏟️ Facilities', href: '/admin/facilities' },
            { label: '💬 Testimonials', href: '/admin/testimonials' },
            { label: '⚙️ Configuration', href: '/admin/configuration' },
          ].map(l => (
            <a key={l.href} href={l.href} className={styles.quickLink}>{l.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
