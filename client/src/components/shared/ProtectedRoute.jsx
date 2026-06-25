import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, guestOk = false }) {
  const { user, guest, loading } = useAuth();
  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );
  if (!user && !(guestOk && guest)) return <Navigate to="/login" replace />;
  return children;
}
