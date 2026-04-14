import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';

// Lazy-load all routes for code splitting
const Home               = lazy(() => import('./Component/Land/Home'));
const DonorDashboard     = lazy(() => import('./Component/Donor/DonorDashboard'));
const DonationCreate     = lazy(() => import('./Component/Donor/DonationCreate'));
const Notifications      = lazy(() => import('./Component/Donor/Notifications'));
const Profile            = lazy(() => import('./Component/Donor/Profile'));
const BeneficiaryForm    = lazy(() => import('./Component/Homes/BeneficiaryRequestForm'));
const DeliveryDashboard  = lazy(() => import('./Component/Picker/DeliveryDashboard'));
const SocialWorkerDash   = lazy(() => import('./Component/Socialworker/SocialWorkerDashboard'));
const DonorData          = lazy(() => import('./Component/Donor/DonorData'));
const AdminDashboard     = lazy(() => import('./Component/AdminDashboard'));

// Full-page loading fallback
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: 16,
  }}>
    <div style={{
      width: 48, height: 48, border: '3px solid var(--border)',
      borderTopColor: 'var(--color-primary)', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Loading…</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SocketProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"                element={<Home />} />
                <Route path="/dash"            element={<DonorDashboard />} />
                <Route path="/create-donation" element={<DonationCreate />} />
                <Route path="/notifications"   element={<Notifications />} />
                <Route path="/profile"         element={<Profile />} />
                <Route path="/homes"           element={<BeneficiaryForm />} />
                <Route path="/picker"          element={<DeliveryDashboard />} />
                <Route path="/social"          element={<SocialWorkerDash />} />
                <Route path="/donor-data"      element={<DonorData />} />
                <Route path="/admin"           element={<AdminDashboard />} />
                <Route path="*"               element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </Router>
        </SocketProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;