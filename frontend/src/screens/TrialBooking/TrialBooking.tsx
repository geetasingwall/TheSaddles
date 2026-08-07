import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { bookingApi, publicApi } from '../../api';
import type { TrialSlot } from '../../types';
import { Button } from '../../components/Buttons/Button';
import { Input, Select } from '../../components/Inputs/Input';
import { Card } from '../../components/Cards/Card';
import { TestimonialForm } from '../../components/TestimonialForm/TestimonialForm';
import styles from './TrialBooking.module.css';

const schema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  mobile_number: z.string().regex(/^\d{10}$/, 'Enter valid 10-digit mobile number'),
  place: z.enum(['Noida', 'New Delhi'], { errorMap: () => ({ message: 'Select a location' }) }),
  number_of_participants: z.coerce.number().min(1).max(10),
});

type FormData = z.infer<typeof schema>;

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function fmt12(t: string) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function toLocalISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function TrialBooking() {
  const today = toLocalISODate(new Date());
  const [trialFee, setTrialFee] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [dayName, setDayName] = useState('');
  const [slots, setSlots] = useState<TrialSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TrialSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{ reference: string; total: number } | null>(null);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    publicApi.getConfig().then(r => {
      const fee = (r.data as any)?.trial_fee;
      if (fee) setTrialFee(Number(fee));
    });
  }, []);

  const handleDateChange = (val: string) => {
    if (!val) { setSelectedDate(''); setDayName(''); setSlots([]); setSelectedSlot(null); setDateError(''); return; }
    // parse as local date to avoid UTC offset shifting the day
    const [y, mo, d] = val.split('-').map(Number);
    const dt = new Date(y, mo - 1, d);
    const day = VALID_DAYS[dt.getDay() === 0 ? 6 : dt.getDay() - 1];
    setSelectedDate(val);
    setDayName(day);
    setSelectedSlot(null);
    setDateError('');
    bookingApi.getSlots(val).then(r => {
      const s = (r.data as TrialSlot[]) || [];
      setSlots(s);
      if (s.length === 0) setDateError('No slots available on this day.');
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedSlot) { setError('Please select a time slot'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.create({
        ...data,
        booking_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      });
      if (res.success && res.data) {
        const d = res.data as { booking_reference: string; total_amount: number };
        setConfirmation({ reference: d.booking_reference, total: d.total_amount });
      } else {
        setError(res.message || 'Booking failed');
      }
    } catch {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <div className={styles.page}>
        <Card className={styles.confirmCard}>
          <div className={styles.confirmIcon}>✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Your booking reference: <strong>{confirmation.reference}</strong></p>
          <p>Total amount payable at club: <strong>₹{confirmation.total}</strong></p>
          <p className={styles.note}>Please arrive 10 minutes before your slot. Payment is collected at the club.</p>
          <Button onClick={() => { setConfirmation(null); setSelectedDate(''); setSlots([]); setSelectedSlot(null); }}>Book Another Slot</Button>
          <div className={styles.reviewPrompt}>
            <h3>Enjoyed a previous ride? Share your experience 💬</h3>
            <TestimonialForm customerType="Student" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Book a Trial Ride</h1>
        <p>Experience horse riding with our professional coaches. {trialFee ? `₹${trialFee}` : '…'} per rider, payable at the club.</p>
      </div>

      <div className={styles.container}>
        <Card title="Select Date" className={styles.step}>
          <p className={styles.scheduleNote}>
            📅 Mon – Sat: Evening slots &nbsp;·&nbsp; Sunday: Morning slot only
          </p>
          <input
            type="date"
            className={styles.datePicker}
            min={today}
            value={selectedDate}
            onChange={e => handleDateChange(e.target.value)}
          />
          {selectedDate && dayName && (
            <p className={styles.dayLabel}>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          )}
          {dateError && <p className={styles.noSlots}>{dateError}</p>}
        </Card>

        {selectedDate && slots.length > 0 && (
          <Card title="Select Time Slot" className={styles.step}>
            <div className={styles.slotGrid}>
              {slots.map(slot => (
                <button
                  key={slot.slot_id}
                  className={`${styles.slotBtn} ${selectedSlot?.slot_id === slot.slot_id ? styles.selected : ''} ${slot.available_slots === 0 ? styles.full : ''}`}
                  onClick={() => slot.available_slots > 0 && setSelectedSlot(slot)}
                  disabled={slot.available_slots === 0}
                >
                  <span className={styles.slotTime}>{fmt12(slot.start_time)} – {fmt12(slot.end_time)}</span>
                  <span className={styles.slotAvail}>
                    {slot.available_slots === 0 ? 'Full' : `${slot.available_slots} seat${slot.available_slots > 1 ? 's' : ''} left`}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {selectedSlot && (
          <Card title="Your Details" className={styles.step}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Input label="Full Name *" placeholder="Enter your name" error={errors.full_name?.message} {...register('full_name')} />
              <Input label="Mobile Number *" placeholder="10-digit mobile number" error={errors.mobile_number?.message} {...register('mobile_number')} />
              <Select
                label="Location *"
                options={[{ value: 'Noida', label: 'Noida' }, { value: 'New Delhi', label: 'New Delhi' }]}
                error={errors.place?.message}
                {...register('place')}
              />
              <Input label="Number of Riders *" type="number" min={1} max={selectedSlot.available_slots} error={errors.number_of_participants?.message} {...register('number_of_participants')} />

              {error && <div className={styles.errorMsg}>{error}</div>}

              <div className={styles.summary}>
                <strong>Booking Summary:</strong>
                <span>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} | {fmt12(selectedSlot.start_time)} – {fmt12(selectedSlot.end_time)}</span>
              </div>

              <Button type="submit" loading={loading} size="lg">Confirm Booking</Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
