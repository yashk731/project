import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../services/googleSheets';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
