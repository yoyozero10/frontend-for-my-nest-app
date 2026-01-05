import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';

export default function HomePage() {
    // Fetch jobs từ API
    const { data, isLoading, isError, error } = useJobs(1, 9); // Lấy 9 jobs cho grid 3x3

    return (
        <div className="min-h-screen bg-stone-50 selection:bg-red-100 selection:text-red-900">
            <Navigation />
            <Hero />

            {/* Filters & Stats Section */}
            <section className="border-y border-stone-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox w-4 h-4 rounded border border-stone-300 appearance-none transition-colors"
                                />
                                <span className="text-sm text-stone-600 group-hover:text-stone-900">
                                    IT / Software
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox w-4 h-4 rounded border border-stone-300 appearance-none transition-colors"
                                    defaultChecked
                                />
                                <span className="text-sm text-stone-600 group-hover:text-stone-900">
                                    Marketing
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox w-4 h-4 rounded border border-stone-300 appearance-none transition-colors"
                                />
                                <span className="text-sm text-stone-600 group-hover:text-stone-900">
                                    Kinh doanh
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center gap-6 border-l border-stone-200 pl-6">
                            <div className="text-right">
                                <p className="text-xs font-mono text-stone-400 uppercase">
                                    Công ty tuyển dụng
                                </p>
                                <p className="text-lg font-semibold tracking-tight">
                                    {data?.data?.meta?.total || 0}+
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-mono text-stone-400 uppercase">
                                    Việc làm đang tuyển
                                </p>
                                <p className="text-lg font-semibold tracking-tight">
                                    {data?.data?.meta?.total || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Listings Grid */}
            <section className="max-w-7xl mx-auto pt-20 pr-6 pb-20 pl-6">
                <div className="flex mb-12 items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight mb-2">
                            Cơ hội việc làm mới nhất
                        </h2>
                        <p className="text-stone-500 text-sm">
                            Các vị trí hấp dẫn từ các công ty hàng đầu Việt Nam.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="text-sm font-medium text-stone-900 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                        Xem tất cả
                        <ArrowRight className="w-3 h-3" />
                    </a>
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
                        <p className="text-red-600 text-sm mt-2">
                            {error?.message || 'Vui lòng thử lại sau'}
                        </p>
                    </div>
                )}

                {/* Jobs grid */}
                {!isLoading && !isError && data?.data?.result && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.data.result.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && data?.data?.result?.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-stone-500">Chưa có việc làm nào</p>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
