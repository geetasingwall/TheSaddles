import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { studentApi } from '../../api';
import { fmtDate } from '../../utils/date';
import { Card, StatCard } from '../../components/Cards/Card';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { TestimonialForm } from '../../components/TestimonialForm/TestimonialForm';
import { ProgressCharts } from '../../components/ProgressCharts/ProgressCharts';
import type { ProgressEntry } from '../../components/ProgressCharts/ProgressCharts';
import styles from './StudentDashboard.module.css';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function AttendanceHeatmap({ records }: { records: { date: string; status: string }[] }) {
  // Group by YYYY-MM — parse date parts directly to avoid timezone shifts
  const byMonth: Record<string, Record<number, string>> = {};
  records.forEach(r => {
    const [yr, mo, day] = r.date.split('-').map(Number);
    const key = `${yr}-${String(mo).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = {};
    byMonth[key][day] = r.status;
  });

  const months = Object.keys(byMonth).sort().reverse();

  return (
    <div className={styles.heatmapWrap}>
      {months.map(key => {
        const [yr, mo] = key.split('-').map(Number);
        const monthDate = new Date(yr, mo - 1, 1);
        const label = new Date(yr, mo - 1, 1).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'long', year: 'numeric' });
        const firstDay = monthDate.getDay();
        const daysInMonth = new Date(yr, mo, 0).getDate();
        const dayMap = byMonth[key];
        const present = Object.values(dayMap).filter(s => s === 'Present').length;
        const total = Object.values(dayMap).length;

        // Build grid cells: leading blanks + day cells
        const cells: { day: number | null; status?: string }[] = [
          ...Array(firstDay).fill({ day: null }),
          ...Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            status: dayMap[i + 1],
          })),
        ];

        return (
          <div key={key} className={styles.monthBlock}>
            <div className={styles.monthHeader}>
              <span className={styles.monthLabel}>{label}</span>
              <span className={styles.monthStat}>
                <span className={styles.presentCount}>{present}P</span>
                &nbsp;/&nbsp;
                <span className={styles.absentCount}>{total - present}A</span>
                &nbsp;of {total}
              </span>
            </div>
            <div className={styles.dayLabels}>
              {DAY_LABELS.map((d, i) => <span key={i} className={styles.dayLabel}>{d}</span>)}
            </div>
            <div className={styles.calGrid}>
              {cells.map((c, i) => (
                <div key={i} className={
                  c.day === null ? styles.blank
                  : c.status === 'Present' ? styles.present
                  : c.status === 'Absent' ? styles.absent
                  : styles.noRecord
                } title={c.day ? `${c.day} ${label}: ${c.status ?? 'No record'}` : undefined}>
                  {c.day ?? ''}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StudentDashboard() {
  const { user } = useStore();
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [attendance, setAttendance] = useState<Record<string, unknown> | null>(null);
  const [progress, setProgress] = useState<unknown[]>([]);
  const [feeData, setFeeData] = useState<any>(null);
  const [videos, setVideos] = useState<{ id: string; title: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;
    Promise.all([
      studentApi.getDashboard(user.user_id),
      studentApi.getAttendance(user.user_id),
      studentApi.getProgress(user.user_id),
      studentApi.getFees(user.user_id),
      studentApi.getVideos(user.user_id),
    ]).then(([d, a, p, f, v]) => {
      setDashboard(d.data as Record<string, unknown>);
      setAttendance(a.data as Record<string, unknown>);
      setProgress((p.data as unknown[]) || []);
      setFeeData(f.data as any);
      setVideos((v.data as any[]) || []);
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className={styles.loading}>Loading your dashboard...</div>;
  if (!dashboard) return <div className={styles.loading}>Dashboard not available.</div>;

  const student = dashboard.student as Record<string, unknown>;
  const att = dashboard.attendance as Record<string, unknown>;
  const prog = dashboard.progress as Record<string, unknown>;
  const attRecords = (attendance as Record<string, unknown>)?.records as { date: string; status: string }[] || [];
  const monthlyFee = Number(feeData?.monthly_fee || 0);
  const totalPaid = Number(feeData?.total_paid || 0);
  const feeHistory: any[] = feeData?.payment_history || [];

  const progressEntries: ProgressEntry[] = (progress as Array<Record<string, unknown>>).map(p => ({
    assessment_date: String(p.date ?? p.assessment_date ?? ''),
    riding_level: String(p.riding_level ?? 'Beginner'),
    performance_rating: p.performance_rating != null ? Number(p.performance_rating) : null,
    skills_learned: p.skills_learned ? String(p.skills_learned) : null,
    strengths: p.strengths ? String(p.strengths) : null,
    areas_for_improvement: p.areas_for_improvement ? String(p.areas_for_improvement) : null,
    next_goals: p.next_goals ? String(p.next_goals) : null,
    coach_remarks: p.coach_remarks ? String(p.coach_remarks) : null,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Welcome, {String(student?.name || 'Student')} 👋</h1>
        <p>Student #{String(student?.student_number || '')} | {String(student?.status || '')}</p>
      </div>

      <div className={styles.stats}>
        <StatCard label="Total Classes" value={Number(att?.total_classes || 0)} icon={<Calendar size={28} />} />
        <StatCard label="Present" value={Number(att?.present || 0)} icon={<Users size={28} />} />
        <StatCard label="Attendance %" value={`${Number(att?.percentage || 0)}%`} icon={<TrendingUp size={28} />} />
        <StatCard label="Monthly Fee" value={`₹${monthlyFee.toLocaleString('en-IN')}`} icon={<DollarSign size={28} />} />
      </div>

      <div className={styles.grid}>
        <Card title="Current Level">
          <div className={styles.level}>{String(prog?.current_level || 'Beginner')}</div>
        </Card>

        <Card title="🎬 My Videos">
          {videos.length === 0 ? (
            <p className={styles.empty}>No videos assigned yet.</p>
          ) : (
            <div className={styles.videoList}>
              {videos.map(v => (
                <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                  <span className={styles.videoIcon}>▶</span>
                  <span className={styles.videoTitle}>{v.title}</span>
                </a>
              ))}
            </div>
          )}
        </Card>

        <Card title="Attendance" className={styles.fullWidth}>
          {attRecords.length === 0 ? (
            <p className={styles.empty}>No attendance records yet.</p>
          ) : (
            <AttendanceHeatmap records={attRecords} />
          )}
        </Card>

        <Card title="Progress Charts" className={styles.fullWidth}>
          {progress.length === 0 ? (
            <p className={styles.empty}>No progress data yet. Charts will appear after your first assessment.</p>
          ) : (
<ProgressCharts records={progressEntries} />
          )}
        </Card>

        <Card title="Progress History">
          {progress.length === 0 ? (
            <p className={styles.empty}>No progress records yet.</p>
          ) : (
            <div className={styles.progressList}>
              {(progress as any[]).map((p, i) => (
                <div key={i} className={styles.progressRow}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className={styles.progressLevel}>{String(p.riding_level)}</div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {p.performance_rating && (
                        <span style={{ color: '#f5a623', fontSize: '0.9rem' }}>{'⭐'.repeat(Number(p.performance_rating))}</span>
                      )}
                      <div className={styles.progressDate}>
                        {fmtDate(String(p.date), { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  {p.skills_learned && <div className={styles.progressField}><span className={styles.fieldLabel}>Skills:</span> {String(p.skills_learned)}</div>}
                  {p.strengths && <div className={styles.progressField}><span className={styles.fieldLabel}>Strengths:</span> {String(p.strengths)}</div>}
                  {p.areas_for_improvement && <div className={styles.progressField}><span className={styles.fieldLabel}>Improve:</span> {String(p.areas_for_improvement)}</div>}
                  {p.next_goals && <div className={styles.progressField}><span className={styles.fieldLabel}>Next Goals:</span> {String(p.next_goals)}</div>}
                  {p.coach_remarks && <div className={styles.progressRemarks}>💬 {String(p.coach_remarks)}</div>}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Fee Payments">
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly Fee: </span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{monthlyFee.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 16 }}>Total Paid: </span>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{totalPaid.toLocaleString('en-IN')}</span>
          </div>
          {feeHistory.length === 0 ? (
            <p className={styles.empty}>No payments recorded yet.</p>
          ) : (
            <div className={styles.attList}>
              {feeHistory.map((p: any, i: number) => (
                <div key={i} className={styles.attRow}>
                  <span>{fmtDate(p.date)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {fmtDate(p.month, { month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.mode}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Share Your Experience 💬">
          <TestimonialForm prefillName={String(student?.name || '')} customerType="Student" />
        </Card>
      </div>
    </div>
  );
}
