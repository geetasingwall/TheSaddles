import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useStore } from '../../store';
import { Button } from '../../components/Buttons/Button';
import { Input } from '../../components/Inputs/Input';
import { Card } from '../../components/Cards/Card';
import styles from './Login.module.css';

export function Login() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) { setError('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(mobile);
      if (res.success && res.data) {
        const user = res.data;
        if (user.user_type === 'ADMIN') { setUser(user); navigate('/admin'); }
        else if (user.user_type === 'COACH') { setUser(user); navigate('/coach'); }
        else if (user.user_type === 'STUDENT') { setUser(user); navigate('/student'); }
        else if (user.user_type === 'PENDING') { setUser(user); navigate('/pending'); }
        else { setError('Mobile number not recognised. Please register or contact the club.'); }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.logo}><img src="/logo.jpg" alt="Club Logo" /></div>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Enter your mobile number to access your dashboard</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <Input
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            maxLength={10}
            inputMode="numeric"
          />
          {error && <div className={styles.error}>{error}</div>}
          <Button type="submit" loading={loading} size="lg">Login</Button>
        </form>

        <div className={styles.links}>
          <a href="/registration">New here? Register →</a>
          <a href="/trial-booking">Book a trial ride →</a>
        </div>
      </Card>
    </div>
  );
}
