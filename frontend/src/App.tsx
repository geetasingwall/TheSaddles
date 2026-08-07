import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { Navbar } from './components/Navigation/Navbar';
import { Landing } from './screens/Landing/Landing';
import { Login } from './screens/Landing/Login';
import { TrialBooking } from './screens/TrialBooking/TrialBooking';
import { Registration } from './screens/Registration/Registration';
import { StudentDashboard } from './screens/StudentDashboard/StudentDashboard';
import { CoachDashboard } from './screens/CoachDashboard/CoachDashboard';
import { AdminDashboard } from './screens/AdminDashboard/AdminDashboard';
import { AdminRegistrations } from './screens/AdminRegistrations/AdminRegistrations';
import { AdminFacilities } from './screens/AdminFacilities/AdminFacilities';
import { AdminStudents } from './screens/AdminStudents/AdminStudents';
import { AdminTestimonials } from './screens/Testimonials/AdminTestimonials';
import { AdminHorses } from './screens/AdminHorses/AdminHorses';
import { AdminConfiguration } from './screens/AdminConfiguration/AdminConfiguration';
import { Horses } from './screens/Horses/Horses';
import { Facilities } from './screens/Facilities/Facilities';
import { Contact } from './screens/Contact/Contact';
import type { ReactNode } from 'react';

function ProtectedRoute({ children, requiredType }: { children: ReactNode; requiredType: string }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.user_type !== requiredType) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trial-booking" element={<TrialBooking />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/horses" element={<Horses />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/student" element={<ProtectedRoute requiredType="STUDENT"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/coach" element={<ProtectedRoute requiredType="COACH"><CoachDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredType="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/registrations" element={<ProtectedRoute requiredType="ADMIN"><AdminRegistrations /></ProtectedRoute>} />
        <Route path="/admin/facilities" element={<ProtectedRoute requiredType="ADMIN"><AdminFacilities /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute requiredType="ADMIN"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/testimonials" element={<ProtectedRoute requiredType="ADMIN"><AdminTestimonials /></ProtectedRoute>} />
        <Route path="/admin/horses" element={<ProtectedRoute requiredType="ADMIN"><AdminHorses /></ProtectedRoute>} />
        <Route path="/admin/configuration" element={<ProtectedRoute requiredType="ADMIN"><AdminConfiguration /></ProtectedRoute>} />
        <Route path="/pending" element={
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2 style={{ color: '#2c5f2e' }}>Registration Pending</h2>
            <p style={{ color: '#6c757d', marginTop: '12px' }}>Your registration is awaiting admin approval. Please check back later.</p>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  );
}
