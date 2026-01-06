import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '../../stores/authStore';
import { LogOut } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-stone-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-stone-900">
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-stone-900">{user?.name}</p>
                                <p className="text-xs text-stone-500">{user?.role?.name}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 text-stone-600" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
