import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = () => {
  const { session, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
