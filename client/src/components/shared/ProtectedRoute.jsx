import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, guestOk = false }) {
  const { user, guest, loading, continueAsGuest } = useAuth();

  useEffect(() => {
    if (!loading && !user && guestOk && !guest) {
      continueAsGuest();
    }
  }, [loading, user, guestOk, guest]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || (!user && guestOk && !guest)) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );
  if (!user && !guest) return <Navigate to="/login" replace />;
  return children;
}
