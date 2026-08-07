const IST = 'Asia/Kolkata';

export function fmtDate(value: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(value).toLocaleDateString('en-IN', { timeZone: IST, ...opts });
}

export function fmtDateTime(value: string | Date): string {
  return new Date(value).toLocaleString('en-IN', { timeZone: IST, day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
