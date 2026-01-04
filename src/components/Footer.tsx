import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                                J
                            </div>
                            <span className="font-bold tracking-tight text-sm">
                                JOBPORTAL.VN
                            </span>
                        </div>
                        <p className="text-sm text-stone-500 mb-6 max-w-xs">
                            Nền tảng tuyển dụng hàng đầu Việt Nam. Kết nối ứng viên với các
                            công ty uy tín trên toàn quốc.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="text-stone-400 hover:text-stone-900 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-stone-400 hover:text-stone-900 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-stone-400 hover:text-stone-900 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4">Ứng viên</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li>
                                <Link
                                    to="/jobs"
                                    className="hover:text-red-600 transition-colors"
                                >
                                    Tìm việc làm
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="hover:text-red-600 transition-colors"
                                >
                                    Tạo hồ sơ
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    Hướng dẫn nghề nghiệp
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    Mức lương tham khảo
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4">Nhà tuyển dụng</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li>
                                <Link
                                    to="/post-job"
                                    className="hover:text-red-600 transition-colors"
                                >
                                    Đăng tin tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    Tìm ứng viên
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    Bảng giá
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4">Công ty</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li>
                                <Link
                                    to="/about"
                                    className="hover:text-red-600 transition-colors"
                                >
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    Tuyển dụng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    Tin tức
                                </a>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-red-600 transition-colors"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-stone-400 font-mono">
                        © 2024 JobPortal.vn. Made in Vietnam.
                    </p>
                    <div className="flex gap-6 text-xs text-stone-400">
                        <a href="#" className="hover:text-stone-900">
                            Chính sách bảo mật
                        </a>
                        <a href="#" className="hover:text-stone-900">
                            Điều khoản sử dụng
                        </a>
                        <a href="#" className="hover:text-stone-900">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
