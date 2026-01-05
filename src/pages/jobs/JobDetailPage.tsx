import { useParams, useNavigate } from 'react-router-dom';
import { useJobDetail } from '../../hooks/useJobs';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import {
    MapPin,
    DollarSign,
    Briefcase,
    Calendar,
    Clock,
    ArrowLeft,
    Loader2,
    Building2
} from 'lucide-react';

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useJobDetail(id!);

    const job = data?.data;

    // Format salary
    const formatSalary = (salary: number) => {
        if (salary >= 1000000) {
            return `${(salary / 1000000).toFixed(0)} triệu VNĐ`;
        }
        return `${(salary / 1000).toFixed(0)}K VNĐ`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navigation />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    <span className="ml-3 text-stone-600">Đang tải thông tin việc làm...</span>
                </div>
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-6 py-32">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <p className="text-red-800 font-medium text-lg">
                            Không tìm thấy thông tin việc làm
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 text-red-600 hover:text-red-700 font-medium"
                        >
                            ← Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <Navigation />

            <main className="max-w-5xl mx-auto px-6 py-24">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Quay lại</span>
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job header */}
                        <div className="bg-white rounded-xl border border-stone-200 p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-8 h-8 text-stone-400" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-semibold text-stone-900 mb-2">
                                        {job.name}
                                    </h1>
                                    <p className="text-lg text-stone-600 font-medium">
                                        {job.company.name}
                                    </p>
                                </div>
                                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                    {job.level}
                                </div>
                            </div>

                            {/* Quick info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-stone-600">
                                    <MapPin className="w-5 h-5 text-stone-400" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-stone-600">
                                    <DollarSign className="w-5 h-5 text-stone-400" />
                                    <span className="font-semibold text-red-600">
                                        {formatSalary(job.salary)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-stone-600">
                                    <Briefcase className="w-5 h-5 text-stone-400" />
                                    <span>{job.quantity} vị trí</span>
                                </div>
                                <div className="flex items-center gap-3 text-stone-600">
                                    <Calendar className="w-5 h-5 text-stone-400" />
                                    <span>Hạn nộp: {formatDate(job.endDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Job description */}
                        <div className="bg-white rounded-xl border border-stone-200 p-8">
                            <h2 className="text-xl font-semibold text-stone-900 mb-4">
                                Mô tả công việc
                            </h2>
                            <div className="prose prose-stone max-w-none">
                                <p className="text-stone-600 whitespace-pre-line">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Skills required */}
                        <div className="bg-white rounded-xl border border-stone-200 p-8">
                            <h2 className="text-xl font-semibold text-stone-900 mb-4">
                                Kỹ năng yêu cầu
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-24">
                            <h3 className="font-semibold text-stone-900 mb-4">
                                Thông tin tuyển dụng
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-stone-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                                            Ngày bắt đầu
                                        </p>
                                        <p className="text-sm font-medium text-stone-900">
                                            {formatDate(job.startDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                                            Hạn nộp hồ sơ
                                        </p>
                                        <p className="text-sm font-medium text-stone-900">
                                            {formatDate(job.endDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-red-600/20">
                                Ứng tuyển ngay
                            </button>

                            <p className="text-xs text-stone-500 text-center mt-4">
                                Bạn cần đăng nhập để ứng tuyển
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
