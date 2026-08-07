import styles from './Card.module.css';
import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className={styles.statCard}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}
