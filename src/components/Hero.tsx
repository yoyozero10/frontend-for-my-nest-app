import { MapPin, ChevronDown, ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';

export default function Hero() {
    return (
        <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Left: Content */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white w-fit">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                            NỀN TẢNG TUYỂN DỤNG VIỆT NAM
                        </span>
                    </div>

                    <h1 className="md:text-7xl leading-[1.05] text-5xl font-semibold text-stone-900 tracking-tight">
                        Kết nối tài năng{' '}
                        <br />
                        <span className="font-serif italic text-stone-500 font-normal">
                            với cơ hội
                        </span>{' '}
                        nghề nghiệp.
                    </h1>

                    <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
                        Nền tảng tuyển dụng hàng đầu Việt Nam. Kết nối ứng viên tài năng với
                        các công ty và doanh nghiệp uy tín.
                    </p>

                    {/* Search Component */}
                    <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-sm shadow-stone-200/50 mt-4 max-w-2xl">
                        <form className="flex flex-col md:flex-row gap-2">
                            <div className="flex-1 relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Vị trí, kỹ năng hoặc từ khóa"
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-300 transition-all placeholder:text-stone-400"
                                />
                            </div>
                            <div className="flex-1 relative border-l-0 md:border-l border-stone-100 md:pl-2">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <select className="w-full pl-10 pr-8 py-3 bg-stone-50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-300 appearance-none text-stone-600 cursor-pointer">
                                    <option>Tất cả khu vực</option>
                                    <option>Hà Nội</option>
                                    <option>Hồ Chí Minh</option>
                                    <option>Đà Nẵng</option>
                                    <option>Hải Phòng</option>
                                    <option>Cần Thơ</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </div>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
                                Tìm việc
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-6 pt-4 text-xs font-mono text-stone-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-stone-600" />
                            <span>CÔNG TY UY TÍN</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 text-stone-600" />
                            <span>ỨNG VIÊN CHẤT LƯỢNG</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-stone-600" />
                            <span>KẾT NỐI NHANH</span>
                        </div>
                    </div>
                </div>

                {/* Right: Visual */}
                <div className="lg:col-span-5 relative h-full min-h-[400px] lg:min-h-auto">
                    <div className="absolute inset-0 bg-stone-200 rounded-2xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2832&auto=format&fit=crop"
                            alt="Professional workspace"
                            className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
                        />

                        {/* Floating Card */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-xl">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-mono text-stone-500">
                                    TUYỂN DỤNG THÀNH CÔNG
                                </span>
                                <div className="flex gap-0.5 text-red-600">
                                    <CheckCircle className="w-3 h-3 fill-current" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-serif italic text-stone-900 font-bold border border-stone-200">
                                    T
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-stone-900">
                                        Senior Developer
                                    </h3>
                                    <p className="text-xs text-stone-500">
                                        Tuyển dụng tại FPT Software
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
