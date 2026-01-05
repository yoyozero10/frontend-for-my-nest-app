import { useState, useEffect } from 'react';
import { useJobs } from '../../hooks/useJobs';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import JobCard from '../../components/JobCard';
import { Search, MapPin, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobsListPage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset về page 1 khi search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset page khi filter thay đổi
    useEffect(() => {
        setPage(1);
    }, [selectedLocation, selectedLevel]);

    // Build filters object
    const filters = {
        search: debouncedSearch || undefined,
        location: selectedLocation || undefined,
        level: selectedLevel || undefined,
    };

    const pageSize = 12;
    const { data, isLoading, isError } = useJobs(page, pageSize, filters);

    const totalPages = data?.data?.meta?.pages || 1;

    return (
        <div className="min-h-screen bg-stone-50">
            <Navigation />

            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-semibold text-stone-900 mb-4">
                        Tìm việc làm
                    </h1>
                    <p className="text-stone-600">
                        Khám phá {data?.data?.meta?.total || 0} cơ hội việc làm từ các công ty hàng đầu
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm công việc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            />
                        </div>

                        {/* Location filter */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent appearance-none"
                            >
                                <option value="">Tất cả khu vực</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                                <option value="Hải Phòng">Hải Phòng</option>
                                <option value="Cần Thơ">Cần Thơ</option>
                            </select>
                        </div>

                        {/* Level filter */}
                        <div>
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent appearance-none"
                            >
                                <option value="">Tất cả cấp bậc</option>
                                <option value="INTERN">Intern</option>
                                <option value="FRESHER">Fresher</option>
                                <option value="JUNIOR">Junior</option>
                                <option value="MIDDLE">Middle</option>
                                <option value="SENIOR">Senior</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                        <span className="ml-3 text-stone-600">Đang tải việc làm...</span>
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800 font-medium">
                            Không thể tải danh sách việc làm
                        </p>
                        <p className="text-red-600 text-sm mt-2">Vui lòng thử lại sau</p>
                    </div>
                )}

                {/* Jobs grid */}
                {!isLoading && !isError && data?.data?.result && (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {data.data.result.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === pageNum
                                                    ? 'bg-red-600 text-white'
                                                    : 'border border-stone-200 hover:bg-stone-100'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty state */}
                {!isLoading && !isError && data?.data?.result?.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-stone-500 text-lg">Không tìm thấy việc làm phù hợp</p>
                        <p className="text-stone-400 text-sm mt-2">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
