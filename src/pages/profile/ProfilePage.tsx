import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/profile' } });
        }
    }, [isAuthenticated, navigate]);

    if (!user) {
        return null;
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <Navigation />

            <main className="max-w-4xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-stone-900 mb-2">
                        Hồ sơ của tôi
                    </h1>
                    <p className="text-stone-600">
                        Thông tin tài khoản và cài đặt cá nhân
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    {/* Avatar Section */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                <span className="text-4xl font-bold text-red-600">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="text-white">
                                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                                <p className="text-red-100">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                    <User className="w-4 h-4" />
                                    Họ và tên
                                </label>
                                <div className="px-4 py-3 bg-stone-50 rounded-lg border border-stone-200">
                                    <p className="text-stone-900 font-medium">{user.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <div className="px-4 py-3 bg-stone-50 rounded-lg border border-stone-200">
                                    <p className="text-stone-900 font-medium">{user.email}</p>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                    <Shield className="w-4 h-4" />
                                    Vai trò
                                </label>
                                <div className="px-4 py-3 bg-stone-50 rounded-lg border border-stone-200">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                        {user.role?.name || 'USER'}
                                    </span>
                                </div>
                            </div>

                            {/* Created At */}
                            {user.createdAt && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                        <Calendar className="w-4 h-4" />
                                        Ngày tham gia
                                    </label>
                                    <div className="px-4 py-3 bg-stone-50 rounded-lg border border-stone-200">
                                        <p className="text-stone-900 font-medium">
                                            {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Permissions */}
                        {user.permissions && user.permissions.length > 0 && (
                            <div className="pt-6 border-t border-stone-200">
                                <h3 className="text-sm font-medium text-stone-600 mb-3">
                                    Quyền hạn ({user.permissions.length})
                                </h3>
                                <div className="grid md:grid-cols-2 gap-2">
                                    {user.permissions.map((permission: any, index: number) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-sm"
                                        >
                                            <p className="font-medium text-stone-900">{permission.name}</p>
                                            <p className="text-xs text-stone-500 mt-1">
                                                {permission.method} {permission.apiPath}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => navigate('/my-resumes')}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Xem hồ sơ đã nộp
                    </button>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                    >
                        Tìm việc làm
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
