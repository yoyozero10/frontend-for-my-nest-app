import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ClearCachePage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear all React Query cache
        queryClient.clear();

        // Clear localStorage
        localStorage.clear();

        // Clear sessionStorage
        sessionStorage.clear();

        // Wait a bit then redirect to home
        setTimeout(() => {
            navigate('/', { replace: true });
            window.location.reload();
        }, 1000);
    }, [queryClient, navigate]);

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-stone-600">Đang xóa cache và tải lại...</p>
            </div>
        </div>
    );
}
