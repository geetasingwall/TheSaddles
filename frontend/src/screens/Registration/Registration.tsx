import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registrationApi } from '../../api';
import { Button } from '../../components/Buttons/Button';
import { Input, Select, Textarea } from '../../components/Inputs/Input';
import { Card } from '../../components/Cards/Card';
import styles from './Registration.module.css';

const schema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().optional(),
  mobile_number: z.string().regex(/^\d{10}$/, 'Enter valid 10-digit mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  gender: z.string().optional(),
  city: z.string().optional(),
  riding_experience: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_number: z.string().optional(),
  comments: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function Registration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await registrationApi.create({ ...data, first_name: data.first_name, mobile_number: data.mobile_number });
      if (res.success) setSuccess(true);
      else setError(res.message || 'Registration failed');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <Card className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Registration Submitted!</h2>
          <p>Your registration has been submitted successfully and is pending admin approval.</p>
          <p>You will be able to access your student dashboard once approved.</p>
          <p>You can check your status by logging in with your mobile number.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <img src="/logo.jpg" alt="Club Logo" className={styles.headerLogo} />
          <h1>Join Our Club</h1>
        </div>
        <p>Fill in your details to register. Our team will review and approve your application.</p>
      </div>

      <Card title="Registration Form" className={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.row}>
            <Input label="First Name *" placeholder="First name" error={errors.first_name?.message} {...register('first_name')} />
            <Input label="Last Name" placeholder="Last name" {...register('last_name')} />
          </div>
          <div className={styles.row}>
            <Input label="Mobile Number *" placeholder="10-digit mobile" error={errors.mobile_number?.message} {...register('mobile_number')} />
            <Input label="Email" type="email" placeholder="Email address" error={errors.email?.message} {...register('email')} />
          </div>
          <div className={styles.row}>
            <Select label="Gender" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} {...register('gender')} />
            <Input label="City" placeholder="Your city" {...register('city')} />
          </div>
          <Select
            label="Riding Experience"
            options={[
              { value: 'None', label: 'No experience' },
              { value: 'Beginner', label: 'Beginner (< 1 year)' },
              { value: 'Intermediate', label: 'Intermediate (1-3 years)' },
              { value: 'Advanced', label: 'Advanced (3+ years)' },
            ]}
            {...register('riding_experience')}
          />
          <div className={styles.row}>
            <Input label="Emergency Contact Name" placeholder="Contact name" {...register('emergency_contact_name')} />
            <Input label="Emergency Contact Number" placeholder="Contact number" {...register('emergency_contact_number')} />
          </div>
          <Textarea label="Additional Comments" placeholder="Any additional information..." {...register('comments')} />

          {error && <div className={styles.errorMsg}>{error}</div>}

          <Button type="submit" loading={loading} size="lg">Submit Registration</Button>
        </form>
      </Card>
    </div>
  );
}
