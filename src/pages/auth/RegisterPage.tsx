import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
    age: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            await authService.register({
                name: data.name,
                email: data.email,
                password: data.password,
                age: data.age, // Gửi dưới dạng string
                gender: data.gender,
                address: data.address,
            });

            setSuccess(true);

            // Redirect về login sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-2xl w-full">
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
                        Tạo tài khoản
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                        Bắt đầu hành trình tìm việc của bạn ngay hôm nay
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

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    Đăng ký thành công!
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    Đang chuyển hướng đến trang đăng nhập...
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-stone-900 mb-2"
                            >
                                Họ và tên <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    {...register('name')}
                                    type="text"
                                    id="name"
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-stone-900 mb-2"
                            >
                                Email <span className="text-red-600">*</span>
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
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-stone-900 mb-2"
                                >
                                    Mật khẩu <span className="text-red-600">*</span>
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

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-stone-900 mb-2"
                                >
                                    Xác nhận mật khẩu <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        {...register('confirmPassword')}
                                        type="password"
                                        id="confirmPassword"
                                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Optional fields */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label
                                    htmlFor="age"
                                    className="block text-sm font-medium text-stone-900 mb-2"
                                >
                                    Tuổi
                                </label>
                                <input
                                    {...register('age')}
                                    type="number"
                                    id="age"
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                    placeholder="25"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-stone-900 mb-2"
                                >
                                    Giới tính
                                </label>
                                <select
                                    {...register('gender')}
                                    id="gender"
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                >
                                    <option value="">Chọn</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-stone-900 mb-2"
                                >
                                    Địa chỉ
                                </label>
                                <input
                                    {...register('address')}
                                    type="text"
                                    id="address"
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                    placeholder="Hà Nội"
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-1 w-4 h-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
                            />
                            <label htmlFor="terms" className="text-sm text-stone-600">
                                Tôi đồng ý với{' '}
                                <a href="#" className="text-red-600 hover:text-red-700">
                                    Điều khoản sử dụng
                                </a>{' '}
                                và{' '}
                                <a href="#" className="text-red-600 hover:text-red-700">
                                    Chính sách bảo mật
                                </a>
                            </label>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Đăng ký
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-stone-600">
                            Đã có tài khoản?{' '}
                            <Link
                                to="/login"
                                className="text-red-600 hover:text-red-700 font-medium"
                            >
                                Đăng nhập ngay
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
