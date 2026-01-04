import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
    // Mock data - sẽ thay thế bằng data từ API sau
    const mockJobs = [
        {
            id: '1',
            company: 'FPT Software',
            location: 'Hà Nội',
            rating: 4.9,
            distance: '2.5 km',
            image:
                'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=2832&auto=format&fit=crop',
            tags: ['Full-time', 'Senior'],
            workload: '100% Remote',
        },
        {
            id: '2',
            company: 'Viettel Solutions',
            location: 'Hồ Chí Minh',
            rating: 5.0,
            distance: '1.2 km',
            image:
                'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1600&q=80',
            tags: ['Full-time', 'Mid-level'],
            workload: '80-100% Onsite',
        },
        {
            id: '3',
            company: 'VNG Corporation',
            location: 'Hồ Chí Minh',
            rating: 4.8,
            distance: '5 km',
            image:
                'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1600&q=80',
            tags: ['Full-time', 'Junior'],
            workload: '100% Hybrid',
        },
    ];

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
                                <p className="text-lg font-semibold tracking-tight">1,200+</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-mono text-stone-400 uppercase">
                                    Ứng viên đang tìm việc
                                </p>
                                <p className="text-lg font-semibold tracking-tight">15,000+</p>
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockJobs.map((job) => (
                        <JobCard key={job.id} {...job} />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
