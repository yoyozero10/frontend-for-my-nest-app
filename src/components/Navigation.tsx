import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center font-bold text-lg tracking-tighter">
                        J
                    </div>
                    <span className="font-semibold tracking-tight text-lg group-hover:text-red-600 transition-colors">
                        JOBPORTAL.VN
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
                    <Link to="/jobs" className="hover:text-stone-900 transition-colors">
                        Tìm việc làm
                    </Link>
                    <Link to="/companies" className="hover:text-stone-900 transition-colors">
                        Công ty
                    </Link>
                    <Link to="/subscribe" className="hover:text-stone-900 transition-colors">
                        Đăng ký nhận việc
                    </Link>
                    <Link to="/about" className="hover:text-stone-900 transition-colors">
                        Giới thiệu
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated && user ? (
                        // User dropdown
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden md:block text-sm font-medium text-stone-900">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-4 h-4 text-stone-600" />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-stone-200 py-2">
                                    <div className="px-4 py-3 border-b border-stone-100">
                                        <p className="text-sm font-medium text-stone-900">{user.name}</p>
                                        <p className="text-xs text-stone-500 mt-1">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        Hồ sơ của tôi
                                    </Link>
                                    <Link
                                        to="/my-resumes"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        Hồ sơ đã nộp
                                    </Link>
                                    {/* Admin shortcut for admin roles */}
                                    {(user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN' || user?.role?.name === 'HR') && (
                                        <Link
                                            to="/admin"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Quản trị
                                        </Link>
                                    )}
                                    <hr className="my-2 border-stone-100" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Login/Register buttons
                        <>
                            <Link
                                to="/login"
                                className="hidden md:flex text-sm font-medium text-stone-600 hover:text-stone-900"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="bg-stone-900 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors duration-300"
                            >
                                Đăng ký / Đăng tin
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
