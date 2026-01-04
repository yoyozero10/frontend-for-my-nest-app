import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError('');

        try {
            await login(data.email, data.password);
            navigate('/'); // Redirect về trang chủ sau khi login thành công
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-bold text-xl tracking-tighter">
                            J
                        </div>
                        <span className="font-semibold tracking-tight text-xl group-hover:text-red-600 transition-colors">
                            JOBPORTAL.VN
                        </span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-semibold text-stone-900">
                        Đăng nhập
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                        Chào mừng bạn quay trở lại!
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-stone-900 mb-2"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    {...register('email')}
                                    type="email"
                                    id="email"
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-stone-900 mb-2"
                            >
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    {...register('password')}
                                    type="password"
                                    id="password"
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 text-sm text-stone-600"
                                >
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-stone-600">
                            Chưa có tài khoản?{' '}
                            <Link
                                to="/register"
                                className="text-red-600 hover:text-red-700 font-medium"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        ← Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
