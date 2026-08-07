import { useState } from 'react';
import styles from './ProgressCharts.module.css';

export interface ProgressEntry {
  assessment_date: string;
  riding_level: string;
  performance_rating?: number | null;
  skills_learned?: string | null;
  strengths?: string | null;
  areas_for_improvement?: string | null;
  next_goals?: string | null;
  coach_remarks?: string | null;
}

const LEVELS = ['Beginner', 'Novice', 'Elementary', 'Medium', 'Advanced', 'Expert'];
const levelIndex = (l: string) => { const i = LEVELS.indexOf(l); return i >= 0 ? i : 0; };

const W = 520;
const H = 160;
const PAD = { top: 12, right: 16, bottom: 36, left: 80 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

interface Pt { label: string; raw: number; }
interface Tip { x: number; y: number; label: string; value: string; }

function Chart({ points, yMin, yMax, yLabels, color, tipFmt }: {
  points: Pt[]; yMin: number; yMax: number; yLabels: string[]; color: string; tipFmt: (v: number) => string;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  if (points.length === 0) return null;

  const xs = (i: number) => points.length === 1 ? CW / 2 : (i / (points.length - 1)) * CW;
  const ys = (v: number) => CH - ((v - yMin) / Math.max(yMax - yMin, 1)) * CH;

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xs(i).toFixed(1)} ${ys(p.raw).toFixed(1)}`).join(' ');
  const area = `${line} L ${xs(points.length - 1).toFixed(1)} ${CH} L ${xs(0).toFixed(1)} ${CH} Z`;

  const showLabel = (i: number) => points.length <= 7 || i % Math.ceil(points.length / 7) === 0 || i === points.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} onMouseLeave={() => setTip(null)}>
      {/* Y grid lines only — no labels here */}
      {yLabels.map((_, i) => {
        const v = yMin + (i / (yLabels.length - 1)) * (yMax - yMin);
        const cy = PAD.top + ys(v);
        return <line key={i} x1={PAD.left} x2={PAD.left + CW} y1={cy} y2={cy} stroke="#e0e0e0" strokeWidth="1" />;
      })}

      {/* Y axis labels — drawn fully outside the plot, right-aligned to PAD.left - 8 */}
      {yLabels.map((lbl, i) => {
        const v = yMin + (i / (yLabels.length - 1)) * (yMax - yMin);
        const cy = PAD.top + ys(v);
        return (
          <text key={`lbl-${i}`} x={PAD.left - 8} y={cy + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#333">{lbl}</text>
        );
      })}

      {/* Left axis border */}
      <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + CH} stroke="#ccc" strokeWidth="1" />

      {/* Area + line */}
      <g transform={`translate(${PAD.left},${PAD.top})`}>
        <path d={area} fill={color} fillOpacity="0.1" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </g>

      {/* Dots + x-labels */}
      {points.map((p, i) => {
        const cx = PAD.left + xs(i);
        const cy = PAD.top + ys(p.raw);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill={color} stroke="#fff" strokeWidth="2" style={{ cursor: 'pointer' }}
              onMouseEnter={() => setTip({ x: cx, y: cy, label: p.label, value: tipFmt(p.raw) })} />
            {showLabel(i) && (
              <text x={cx} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="#444">{p.label}</text>
            )}
          </g>
        );
      })}

      {/* Tooltip */}
      {tip && (() => {
        const bw = 96; const bh = 38;
        const bx = Math.max(4, Math.min(tip.x - bw / 2, W - bw - 4));
        const by = tip.y - bh - 10 < 0 ? tip.y + 10 : tip.y - bh - 10;
        return (
          <g pointerEvents="none">
            <rect x={bx} y={by} width={bw} height={bh} rx="5" fill="#222" fillOpacity="0.85" />
            <text x={bx + bw / 2} y={by + 13} textAnchor="middle" fontSize="9" fill="#ccc">{tip.label}</text>
            <text x={bx + bw / 2} y={by + 28} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">{tip.value}</text>
          </g>
        );
      })()}
    </svg>
  );
}

export function ProgressCharts({ records }: { records: ProgressEntry[] }) {
  const sorted = [...records].sort((a, b) => a.assessment_date.localeCompare(b.assessment_date));
  if (sorted.length === 0) return null;

  const levelPts: Pt[] = sorted.map(r => ({ label: fmtDate(r.assessment_date), raw: levelIndex(r.riding_level) }));
  const ratingPts: Pt[] = sorted
    .filter(r => r.performance_rating != null)
    .map(r => ({ label: fmtDate(r.assessment_date), raw: r.performance_rating! }));

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const levelsGained = levelIndex(last.riding_level) - levelIndex(first.riding_level);
  const avgRating = ratingPts.length > 0
    ? (ratingPts.reduce((s, p) => s + p.raw, 0) / ratingPts.length).toFixed(1)
    : null;

  return (
    <div className={styles.wrap}>
      {/* Summary strip */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Assessments</span>
          <span className={styles.summaryValue}>{sorted.length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Started At</span>
          <span className={styles.summaryValue}>{LEVELS[levelIndex(first.riding_level)]}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Current Level</span>
          <span className={styles.summaryValue} style={{ color: 'var(--primary)' }}>{LEVELS[levelIndex(last.riding_level)]}</span>
        </div>
        {levelsGained > 0 && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Levels Gained</span>
            <span className={styles.summaryValue} style={{ color: 'var(--success)' }}>+{levelsGained}</span>
          </div>
        )}
        {avgRating && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Avg Rating</span>
            <span className={styles.summaryValue} style={{ color: '#f5a623' }}>{avgRating} ⭐</span>
          </div>
        )}
      </div>

      {/* Charts side by side */}
      <div className={styles.charts}>
        {/* Riding Level chart */}
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>📈 Riding Level Progression</div>
          <Chart
            points={levelPts}
            yMin={0}
            yMax={LEVELS.length - 1}
            yLabels={LEVELS}
            color="#2c5f2e"
            tipFmt={v => LEVELS[Math.round(v)] ?? ''}
          />
        </div>

        {/* Performance Rating chart */}
        {ratingPts.length > 0 ? (
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>⭐ Performance Rating Over Time</div>
            <Chart
              points={ratingPts}
              yMin={1}
              yMax={5}
              yLabels={['1', '2', '3', '4', '5']}
              color="#f5a623"
              tipFmt={v => `${'⭐'.repeat(Math.round(v))} (${Math.round(v)}/5)`}
            />
            <div className={styles.ratingNote}>1 = needs work · 5 = excellent</div>
          </div>
        ) : (
          <div className={styles.chartBox} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#bbb' }}>No ratings recorded yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
