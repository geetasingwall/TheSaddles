import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { useStore } from '../../store';
import { Button } from '../../components/Buttons/Button';
import { Input, Select } from '../../components/Inputs/Input';
import { Card } from '../../components/Cards/Card';
import { fmtDate } from '../../utils/date';
import type { Registration } from '../../types';
import styles from './AdminRegistrations.module.css';

interface Batch { id: string; batch_name: string; coach_id: string; training_day: string; }
interface Coach { id: string; first_name: string; last_name?: string; }

const STATUS_LABELS: Record<string, string> = {
  Pending: '🟡 Pending',
  Approved: '✅ Approved',
  Rejected: '❌ Rejected',
};

export function AdminRegistrations() {
  const { user } = useStore();
  const [regs, setRegs] = useState<Registration[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filter, setFilter] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [approveId, setApproveId] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [approving, setApproving] = useState(false);

  const load = (status: string) => {
    setLoading(true);
    Promise.allSettled([
      adminApi.getRegistrations(status || undefined),
      adminApi.getBatches(),
      adminApi.getCoaches(),
    ]).then(([r, b, c]) => {
      if (r.status === 'fulfilled') setRegs((r.value.data as Registration[]) || []);
      if (b.status === 'fulfilled') setBatches((b.value.data as Batch[]) || []);
      if (c.status === 'fulfilled') setCoaches((c.value.data as Coach[]) || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const coachName = (id: string) => {
    const c = coaches.find(c => c.id === id);
    return c ? `${c.first_name} ${c.last_name || ''}`.trim() : '';
  };

  const handleApprove = async () => {
    if (!approveId || !user?.user_id) return;
    setApproving(true);
    try {
      await adminApi.approveRegistration(approveId, user.user_id, {
        batch_id: selectedBatch || undefined,
        monthly_fee: monthlyFee ? Number(monthlyFee) : undefined,
      });
      setApproveId(null);
      setSelectedBatch('');
      setMonthlyFee('');
      load(filter);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!user?.user_id || !window.confirm('Reject this registration?')) return;
    await adminApi.rejectRegistration(id, user.user_id);
    load(filter);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>📋 All Registrations</h1>

      </div>

      <div className={styles.filters}>
        {['Pending', 'Approved', 'Rejected', ''].map(s => (
          <button key={s} className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
            onClick={() => setFilter(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : regs.length === 0 ? (
        <p className={styles.empty}>No registrations found.</p>
      ) : (
        regs.map(r => {
          const isOpen = expandedId === r.id;
          return (
            <div key={r.id} className={styles.card}>
              <div className={styles.row} onClick={() => setExpandedId(isOpen ? null : r.id)}>
                <div className={styles.info}>
                  <span className={styles.name}>{r.first_name} {r.last_name || ''}</span>
                  <span className={styles.meta}>
                    📞 {r.mobile_number}
                    {r.city && <> · 📍 {r.city}</>}
                    &nbsp;·&nbsp; {fmtDate(r.created_at)}
                  </span>
                </div>
                <div className={styles.right}>
                  <span className={styles.status}>{STATUS_LABELS[r.registration_status] || r.registration_status}</span>
                  <span className={styles.toggle}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className={styles.expanded}>
                  <div className={styles.detailGrid}>
                    {r.email && <div><span className={styles.label}>Email</span><span>{r.email}</span></div>}
                    {r.gender && <div><span className={styles.label}>Gender</span><span>{r.gender}</span></div>}
                    {r.riding_experience && <div><span className={styles.label}>Experience</span><span>{r.riding_experience}</span></div>}
                    <div><span className={styles.label}>Status</span><span>{r.registration_status}</span></div>
                  </div>
                  {r.registration_status === 'Pending' && (
                    <div className={styles.actions}>
                      <Button size="sm" onClick={() => { setApproveId(r.id); setSelectedBatch(''); setMonthlyFee(''); }}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(r.id)}>Reject</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {approveId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Approve Registration</h3>
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
              <Button variant="secondary" onClick={() => setApproveId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
