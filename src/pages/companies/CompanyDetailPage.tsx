import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../hooks/useCompanies';
import { useJobs } from '../../hooks/useJobs';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import JobCard from '../../components/JobCard';
import { MapPin, Building2, Loader2, ArrowLeft, Briefcase } from 'lucide-react';

export default function CompanyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: companyData, isLoading: isLoadingCompany, isError: isErrorCompany } = useCompany(id!);

    // Fetch jobs của company này (filter by company name)
    const { data: jobsData, isLoading: isLoadingJobs } = useJobs(1, 100, {
        // Note: Backend cần hỗ trợ filter theo company name hoặc company ID
        // Tạm thời lấy tất cả jobs và filter ở frontend
    });

    if (isLoadingCompany) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navigation />
                <div className="flex items-center justify-center py-40">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    <span className="ml-3 text-stone-600">Đang tải thông tin công ty...</span>
                </div>
            </div>
        );
    }

    if (isErrorCompany || !companyData?.data) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-6 py-24">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <p className="text-red-800 font-medium text-lg">
                            Không tìm thấy công ty
                        </p>
                        <p className="text-red-600 text-sm mt-2">
                            Công ty này không tồn tại hoặc đã bị xóa
                        </p>
                        <Link
                            to="/companies"
                            className="inline-block mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Quay lại danh sách công ty
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const company = companyData.data;
    const companyLogo = company.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';

    // Filter jobs của company này
    const companyJobs = jobsData?.data?.result?.filter(
        job => job.company._id === company._id || job.company.name === company.name
    ) || [];

    return (
        <div className="min-h-screen bg-stone-50">
            <Navigation />

            <main className="max-w-6xl mx-auto px-6 py-24">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                </button>

                {/* Company header */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-8">
                    <div className="relative h-64 bg-gradient-to-br from-red-600 to-red-800">
                        <img
                            src={companyLogo}
                            alt={company.name}
                            className="w-full h-full object-cover opacity-20"
                            onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
                            }}
                        />
                        <div className="absolute inset-0 flex items-end p-8">
                            <div className="bg-white rounded-xl p-4 shadow-xl">
                                <img
                                    src={companyLogo}
                                    alt={company.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-stone-900 mb-3">
                                    {company.name}
                                </h1>
                                <div className="flex items-center gap-2 text-stone-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{company.address}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-lg">
                                <Building2 className="w-5 h-5 text-stone-600" />
                                <span className="text-sm font-medium text-stone-700">Công ty</span>
                            </div>
                        </div>

                        <div className="border-t border-stone-200 pt-6">
                            <h2 className="text-lg font-semibold text-stone-900 mb-3">
                                Giới thiệu
                            </h2>
                            <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                                {company.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Jobs section */}
                <div className="bg-white rounded-xl border border-stone-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="w-6 h-6 text-red-600" />
                        <h2 className="text-2xl font-bold text-stone-900">
                            Việc làm đang tuyển
                        </h2>
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                            {companyJobs.length}
                        </span>
                    </div>

                    {isLoadingJobs ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                            <span className="ml-3 text-stone-600">Đang tải việc làm...</span>
                        </div>
                    ) : companyJobs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companyJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-stone-500">
                                Công ty hiện không có vị trí tuyển dụng nào
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
