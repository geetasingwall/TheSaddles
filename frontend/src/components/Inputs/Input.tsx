import { forwardRef } from 'react';
import styles from './Input.module.css';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...rest }, ref) => (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <input ref={ref} className={`${styles.input} ${error ? styles.hasError : ''} ${className}`} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...rest }, ref) => (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <select ref={ref} className={`${styles.input} ${error ? styles.hasError : ''} ${className}`} {...rest}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
);
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...rest }, ref) => (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea ref={ref} className={`${styles.input} ${error ? styles.hasError : ''} ${className}`} rows={4} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
);
Textarea.displayName = 'Textarea';
