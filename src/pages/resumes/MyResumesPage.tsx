import { useMyResumes } from '../../hooks/resumes.hooks';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Loader2, FileText, ExternalLink, Calendar, Building2, Briefcase } from 'lucide-react';

interface Resume {
    _id: string;
    url: string;
    status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
    companyId: {
        _id: string;
        name: string;
    };
    jobId: {
        _id: string;
        name: string;
    };
    createdAt: string;
    history: {
        status: string;
        updatedAt: string;
        updatedBy: {
            _id: string;
            email: string;
        };
    }[];
}

export default function MyResumesPage() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useMyResumes();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/my-resumes' } });
        }
    }, [isAuthenticated, navigate]);

    // Debug: Log the full response
    console.log('API Response:', data);
    console.log('data?.data:', data?.data);
    console.log('data?.data?.data:', data?.data?.data);

    // Response structure: axios.data.data (backend wrapper has data field)
    const resumes: Resume[] = Array.isArray(data?.data?.data) ? data.data.data : [];

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-700' },
            REVIEWING: { label: 'Đang xem xét', className: 'bg-blue-100 text-blue-700' },
            APPROVED: { label: 'Được chấp nhận', className: 'bg-green-100 text-green-700' },
            REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navigation />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    <span className="ml-3 text-stone-600">Đang tải hồ sơ...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-6 py-32">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <p className="text-red-800 font-medium text-lg">
                            Không thể tải danh sách hồ sơ
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <Navigation />

            <main className="max-w-6xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-stone-900 mb-2">
                        Hồ sơ của tôi
                    </h1>
                    <p className="text-stone-600">
                        Quản lý và theo dõi các hồ sơ ứng tuyển của bạn
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg border border-stone-200 p-4">
                        <p className="text-sm text-stone-600 mb-1">Tổng hồ sơ</p>
                        <p className="text-2xl font-bold text-stone-900">{resumes.length}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-stone-200 p-4">
                        <p className="text-sm text-stone-600 mb-1">Đang chờ</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {resumes.filter(r => r.status === 'PENDING').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-stone-200 p-4">
                        <p className="text-sm text-stone-600 mb-1">Đang xem xét</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {resumes.filter(r => r.status === 'REVIEWING').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-stone-200 p-4">
                        <p className="text-sm text-stone-600 mb-1">Được chấp nhận</p>
                        <p className="text-2xl font-bold text-green-600">
                            {resumes.filter(r => r.status === 'APPROVED').length}
                        </p>
                    </div>
                </div>

                {/* Resumes List */}
                {resumes.length === 0 ? (
                    <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                        <FileText className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-stone-900 mb-2">
                            Chưa có hồ sơ nào
                        </h3>
                        <p className="text-stone-600 mb-6">
                            Bạn chưa ứng tuyển vào công việc nào. Hãy tìm kiếm và ứng tuyển ngay!
                        </p>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Tìm việc làm
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {resumes.map((resume) => (
                            <div
                                key={resume._id}
                                className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-stone-900 mb-1">
                                            {resume.jobId.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-stone-600">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                <span>{resume.companyId.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Nộp ngày: {formatDate(resume.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(resume.status)}
                                </div>

                                <div className="flex items-center gap-4">
                                    <a
                                        href={resume.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Xem CV
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <button
                                        onClick={() => navigate(`/jobs/${resume.jobId._id}`)}
                                        className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium text-sm"
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        Xem công việc
                                    </button>
                                </div>

                                {/* History */}
                                {resume.history.length > 1 && (
                                    <div className="mt-4 pt-4 border-t border-stone-200">
                                        <p className="text-xs text-stone-500 mb-2">Lịch sử:</p>
                                        <div className="space-y-1">
                                            {resume.history.slice().reverse().map((h, idx) => (
                                                <div key={idx} className="text-xs text-stone-600">
                                                    <span className="font-medium">{h.status}</span>
                                                    {' - '}
                                                    <span>{formatDate(h.updatedAt)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
