import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    // Check authentication
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check admin role if required
    if (requireAdmin && user?.role?.name !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
