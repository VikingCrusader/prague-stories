import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/shared/Navbar';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ProximityPrompt from './components/shared/ProximityPrompt';
import NotificationOptIn from './components/shared/NotificationOptIn';
import { useProximityDetection } from './hooks/useProximityDetection';
import { useNotificationPermission } from './hooks/useNotificationPermission';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import GuidePage from './pages/GuidePage';

function ProximityDetector() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { discovery, dismiss, markCheckedIn } = useProximityDetection(!!user);
  const { showPrompt, request, dismiss: dismissOptIn } = useNotificationPermission();

  if (!user) return null;

  return (
    <>
      {showPrompt && (
        <NotificationOptIn onEnable={request} onDismiss={dismissOptIn} />
      )}
      <ProximityPrompt
        discovery={discovery}
        onDismiss={dismiss}
        onCheckIn={(slug, result) => {
          markCheckedIn(slug);
          window.dispatchEvent(new CustomEvent('proximity-checkin', { detail: { slug } }));
          navigate('/explore', { state: { openSlug: slug } });
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Navbar />
          <ProximityDetector />
          <Routes>
            <Route path="/"          element={<Navigate to="/explore" replace />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/explore"   element={<ProtectedRoute guestOk><ExplorePage /></ProtectedRoute>} />
            <Route path="/map"       element={<ProtectedRoute guestOk><MapPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute guestOk><DashboardPage /></ProtectedRoute>} />
            <Route path="/guide"     element={<ProtectedRoute guestOk><GuidePage /></ProtectedRoute>} />
            <Route path="*"          element={<Navigate to="/explore" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
