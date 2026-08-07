import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const dashboardPath = user?.user_type === 'ADMIN' ? '/admin'
    : user?.user_type === 'COACH' ? '/coach'
    : user?.user_type === 'STUDENT' ? '/student'
    : null;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>The Saddles</Link>

        <button className={styles.toggle} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${styles.links} ${open ? styles.open : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/facilities" onClick={() => setOpen(false)}>Facilities</Link>
          <Link to="/horses" onClick={() => setOpen(false)}>Horses</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/trial-booking" onClick={() => setOpen(false)} className={styles.ctaLink}>Book Trial</Link>

          {user ? (
            <div className={styles.userMenu}>
              {dashboardPath && (
                <Link to={dashboardPath} onClick={() => setOpen(false)} className={styles.dashboardLink}>Dashboard</Link>
              )}
              <span className={styles.userName}><User size={16} /> {user.name || user.mobile_number}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}><LogOut size={16} /> Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className={styles.loginLink}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
