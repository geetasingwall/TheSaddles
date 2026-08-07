import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { coachApi } from '../../api';
import { fmtDate } from '../../utils/date';
import { Card, StatCard } from '../../components/Cards/Card';
import { Button } from '../../components/Buttons/Button';
import { Users, Calendar } from 'lucide-react';
import styles from './CoachDashboard.module.css';

const RIDING_LEVELS = ['Beginner', 'Novice', 'Elementary', 'Medium', 'Advanced', 'Expert'];

interface ProgressForm {
  assessment_date: string;
  riding_level: string;
  performance_rating: string;
  skills_learned: string;
  strengths: string;
  areas_for_improvement: string;
  next_goals: string;
  coach_remarks: string;
}

export function CoachDashboard() {
  const { user } = useStore();
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [students, setStudents] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [trialBookings, setTrialBookings] = useState<any[]>([]);
  const [attendanceLog, setAttendanceLog] = useState<any[]>([]);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [progressStudent, setProgressStudent] = useState<string | null>(null);
  const [progressHistory, setProgressHistory] = useState<Record<string, any[]>>({});
  const [progressForm, setProgressForm] = useState<ProgressForm>({
    assessment_date: new Date().toISOString().split('T')[0],
    riding_level: 'Beginner',
    performance_rating: '',
    skills_learned: '',
    strengths: '',
    areas_for_improvement: '',
    next_goals: '',
    coach_remarks: '',
  });
  const [progressSaving, setProgressSaving] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  useEffect(() => {
    if (!user?.user_id) return;
    Promise.all([
      coachApi.getDashboard(user.user_id),
      coachApi.getStudents(user.user_id),
      coachApi.getTrialBookings(user.user_id),
      coachApi.getAttendance(user.user_id),
    ]).then(([d, s, tb, att]) => {
      setDashboard(d.data as Record<string, unknown>);
      const studentList = (s.data as Array<Record<string, unknown>>) || [];
      setStudents(studentList);
      setAttendanceMap({});
      setTrialBookings((tb.data as any[]) || []);
      setAttendanceLog((att.data as any[]) || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const handleSaveAttendance = async () => {
    if (!user?.user_id || students.length === 0) return;
    setSaving(true);
    setSaveError('');
    const today = new Date().toISOString().split('T')[0];
    if (attendanceDate > today) {
      setSaveError('Cannot mark attendance for a future date.');
      setSaving(false);
      return;
    }
    try {
      const byBatch: Record<string, typeof students> = {};
      students.forEach(s => {
        const bid = String(s.batch_id || '');
        if (!byBatch[bid]) byBatch[bid] = [];
        byBatch[bid].push(s);
      });
      let anySuccess = false;
      for (const [batchId, batchStudents] of Object.entries(byBatch)) {
        if (!batchId) { setSaveError('Missing batch assignment — refresh and try again.'); continue; }
        const records = batchStudents
          .filter(s => attendanceMap[String(s.student_id)])
          .map(s => ({ student_id: String(s.student_id), status: attendanceMap[String(s.student_id)] }));
        if (records.length === 0) continue;
        const res = await coachApi.markAttendance(user.user_id, { attendance_date: attendanceDate, batch_id: batchId, records });
        if (res.success) anySuccess = true;
        else setSaveError(res.message || 'Failed to save attendance.');
      }
      if (anySuccess) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        const att = await coachApi.getAttendance(user.user_id);
        setAttendanceLog((att.data as any[]) || []);
      }
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Unexpected error.');
    } finally {
      setSaving(false);
    }
  };

  const studentAttendanceLog = (() => {
    const map: Record<string, { name: string; student_number: string; days: { date: string; status: string }[] }> = {};
    attendanceLog.forEach((day: any) => {
      day.records.forEach((r: any) => {
        if (!map[r.student_id]) map[r.student_id] = { name: r.name, student_number: r.student_number, days: [] };
        map[r.student_id].days.push({ date: day.date, status: r.status });
      });
    });
    return Object.entries(map).map(([id, v]) => ({ student_id: id, ...v }));
  })();

  async function openProgress(studentId: string) {
    if (progressStudent === studentId) { setProgressStudent(null); return; }
    setProgressStudent(studentId);
    setProgressMsg('');
    if (!progressHistory[studentId]) {
      const r = await coachApi.getStudentProgress(studentId);
      if (r.success) setProgressHistory(prev => ({ ...prev, [studentId]: (r.data as any[]) || [] }));
    }
  }

  async function submitProgress(studentId: string) {
    if (!user?.user_id) return;
    setProgressSaving(true);
    setProgressMsg('');
    const r = await coachApi.addProgress(user.user_id, {
      student_id: studentId,
      assessment_date: progressForm.assessment_date,
      riding_level: progressForm.riding_level,
      performance_rating: progressForm.performance_rating ? parseInt(progressForm.performance_rating) : undefined,
      skills_learned: progressForm.skills_learned || undefined,
      strengths: progressForm.strengths || undefined,
      areas_for_improvement: progressForm.areas_for_improvement || undefined,
      next_goals: progressForm.next_goals || undefined,
      coach_remarks: progressForm.coach_remarks || undefined,
    });
    if (r.success) {
      setProgressMsg('✅ Progress saved!');
      setProgressHistory(prev => ({ ...prev, [studentId]: [] }));
      const hist = await coachApi.getStudentProgress(studentId);
      if (hist.success) setProgressHistory(prev => ({ ...prev, [studentId]: (hist.data as any[]) || [] }));
      setProgressForm(f => ({ ...f, skills_learned: '', strengths: '', areas_for_improvement: '', next_goals: '', coach_remarks: '', performance_rating: '' }));
    } else {
      setProgressMsg('❌ ' + (r.message || 'Failed to save'));
    }
    setProgressSaving(false);
  }

  if (loading) return <div className={styles.loading}>Loading coach dashboard...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Coach Dashboard 🏇</h1>
        <p>Welcome, {String(dashboard?.coach_name || user?.name || 'Coach')}</p>
      </div>

      <div className={styles.stats}>
        <StatCard label="Assigned Students" value={Number(dashboard?.assigned_students || 0)} icon={<Users size={28} />} />
        <StatCard label="Today's Classes" value={Number(dashboard?.today_classes || 0)} icon={<Calendar size={28} />} />
      </div>

      <Card title="Mark Attendance" className={styles.attendanceCard}>
        <div className={styles.attHeader}>
          <input type="date" value={attendanceDate} max={new Date().toISOString().split('T')[0]} onChange={e => setAttendanceDate(e.target.value)} className={styles.dateInput} />
          {saved && <span className={styles.savedMsg}>✅ Attendance saved!</span>}
          {saveError && <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{saveError}</span>}
        </div>

        {students.length === 0 ? (
          <p className={styles.empty}>No students assigned to your batches.</p>
        ) : (
          <>
            <div className={styles.studentList}>
              {students.map(s => (
                <div key={String(s.student_id)} className={styles.studentRow}>
                  <div className={styles.studentInfo}>
                    <span className={styles.studentName}>{String(s.name)}</span>
                    <span className={styles.studentBatch}>{String(s.batch)}</span>
                  </div>
                  <div className={styles.attButtons}>
                    <button
                      className={`${styles.attBtn} ${attendanceMap[String(s.student_id)] === 'Present' ? styles.present : ''}`}
                      onClick={() => setAttendanceMap(prev => ({ ...prev, [String(s.student_id)]: 'Present' }))}
                    >Present</button>
                    <button
                      className={`${styles.attBtn} ${attendanceMap[String(s.student_id)] === 'Absent' ? styles.absent : ''}`}
                      onClick={() => setAttendanceMap(prev => ({ ...prev, [String(s.student_id)]: 'Absent' }))}
                    >Absent</button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleSaveAttendance} loading={saving} className={styles.saveBtn}>Save Attendance</Button>
          </>
        )}
      </Card>

      <Card title={`Attendance (${studentAttendanceLog.length} students)`}>
        {studentAttendanceLog.length === 0 ? (
          <p className={styles.empty}>No attendance records yet.</p>
        ) : (
          studentAttendanceLog.map(s => {
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
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>{s.student_number}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>{present}P</span>
                      &nbsp;/&nbsp;
                      <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{total - present}A</span>
                      &nbsp;of {total}
                    </span>
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

      <Card title={`Student Progress (${students.length} students)`}>
        {students.length === 0 ? (
          <p className={styles.empty}>No students assigned.</p>
        ) : students.map(s => {
          const sid = String(s.student_id);
          const isOpen = progressStudent === sid;
          const history: any[] = progressHistory[sid] || [];
          return (
            <div key={sid} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => openProgress(sid)}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{String(s.name)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>{String(s.batch)}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{isOpen ? '▲ Close' : '▼ Add / View Progress'}</span>
              </div>

              {isOpen && (
                <div style={{ marginTop: 12 }}>
                  {history.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 6 }}>Previous Assessments</div>
                      {history.map((h: any) => (
                        <div key={h.id} style={{ background: '#f8f8f8', borderRadius: 6, padding: '8px 12px', marginBottom: 6, fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600 }}>{h.riding_level}</span>
                            <span style={{ color: '#888' }}>{fmtDate(h.assessment_date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          {h.performance_rating && <div>Rating: {'⭐'.repeat(h.performance_rating)}</div>}
                          {h.skills_learned && <div style={{ color: '#555', marginTop: 2 }}><b>Skills:</b> {h.skills_learned}</div>}
                          {h.strengths && <div style={{ color: '#555', marginTop: 2 }}><b>Strengths:</b> {h.strengths}</div>}
                          {h.areas_for_improvement && <div style={{ color: '#555', marginTop: 2 }}><b>Improve:</b> {h.areas_for_improvement}</div>}
                          {h.next_goals && <div style={{ color: '#555', marginTop: 2 }}><b>Next Goals:</b> {h.next_goals}</div>}
                          {h.coach_remarks && <div style={{ color: '#555', marginTop: 2, fontStyle: 'italic' }}>💬 {h.coach_remarks}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 8 }}>New Assessment</div>
                  <div className={styles.progressGrid}>
                    <div>
                      <label className={styles.label}>Date</label>
                      <input type="date" value={progressForm.assessment_date} max={new Date().toISOString().split('T')[0]}
                        onChange={e => setProgressForm(f => ({ ...f, assessment_date: e.target.value }))}
                        className={styles.input} />
                    </div>
                    <div>
                      <label className={styles.label}>Riding Level *</label>
                      <select value={progressForm.riding_level}
                        onChange={e => setProgressForm(f => ({ ...f, riding_level: e.target.value }))}
                        className={styles.input}>
                        {RIDING_LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={styles.label}>Performance Rating (1–5)</label>
                      <select value={progressForm.performance_rating}
                        onChange={e => setProgressForm(f => ({ ...f, performance_rating: e.target.value }))}
                        className={styles.input}>
                        <option value="">— optional —</option>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {'⭐'.repeat(n)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={styles.label}>Skills Learned</label>
                      <input value={progressForm.skills_learned}
                        onChange={e => setProgressForm(f => ({ ...f, skills_learned: e.target.value }))}
                        className={styles.input} placeholder="e.g. Trotting, posting" />
                    </div>
                    <div>
                      <label className={styles.label}>Strengths</label>
                      <input value={progressForm.strengths}
                        onChange={e => setProgressForm(f => ({ ...f, strengths: e.target.value }))}
                        className={styles.input} placeholder="e.g. Good balance" />
                    </div>
                    <div>
                      <label className={styles.label}>Areas for Improvement</label>
                      <input value={progressForm.areas_for_improvement}
                        onChange={e => setProgressForm(f => ({ ...f, areas_for_improvement: e.target.value }))}
                        className={styles.input} placeholder="e.g. Rein control" />
                    </div>
                    <div>
                      <label className={styles.label}>Next Goals</label>
                      <input value={progressForm.next_goals}
                        onChange={e => setProgressForm(f => ({ ...f, next_goals: e.target.value }))}
                        className={styles.input} placeholder="e.g. Cantering" />
                    </div>
                    <div>
                      <label className={styles.label}>Coach Remarks</label>
                      <input value={progressForm.coach_remarks}
                        onChange={e => setProgressForm(f => ({ ...f, coach_remarks: e.target.value }))}
                        className={styles.input} placeholder="General remarks" />
                    </div>
                  </div>
                  {progressMsg && <div style={{ fontSize: '0.85rem', margin: '8px 0', color: progressMsg.startsWith('✅') ? 'var(--success)' : 'var(--danger)' }}>{progressMsg}</div>}
                  <Button onClick={() => submitProgress(sid)} loading={progressSaving} size="sm" style={{ marginTop: 8 }}>Save Progress</Button>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      <Card title={`Trial Bookings (${trialBookings.length})`}>
        {trialBookings.length === 0 ? (
          <p className={styles.empty}>No trial bookings.</p>
        ) : (
          <div className={styles.studentList}>
            {trialBookings.map((b: any) => (
              <div key={b.id} className={styles.studentRow}>
                <div className={styles.studentInfo}>
                  <span className={styles.studentName}>{b.full_name} &nbsp;<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.mobile_number}</span></span>
                  <span className={styles.studentBatch}>{fmtDate(b.booking_date)} &nbsp;{b.start_time} – {b.end_time} &nbsp;| {b.place} | {b.number_of_participants} rider(s)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 600,
                    background: b.booking_status === 'Completed' ? 'var(--success)' : b.booking_status === 'No Show' ? 'var(--danger)' : 'var(--primary)',
                    color: '#fff'
                  }}>{b.booking_status}</span>
                  {b.booking_status === 'Booked' && (
                    <Button size="sm" onClick={async () => { await coachApi.completeTrialBooking(b.id); setTrialBookings(p => p.map(x => x.id === b.id ? { ...x, booking_status: 'Completed' } : x)); }}>Mark Complete</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
