import { useState } from 'react';
import { useCreateSubscriber } from '../../hooks/subscribers.hooks';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Bell, Mail, User, Tag, CheckCircle, Loader2 } from 'lucide-react';

const COMMON_SKILLS = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'C#', 'PHP', 'Angular', 'Vue.js', 'SQL', 'MongoDB',
    'Docker', 'AWS', 'Azure', 'DevOps', 'Git', 'Agile'
];

export default function SubscribePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        skills: [] as string[],
    });
    const [customSkill, setCustomSkill] = useState('');
    const [success, setSuccess] = useState(false);

    const createSubscriber = useCreateSubscriber();

    const handleToggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const handleAddCustomSkill = () => {
        if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, customSkill.trim()]
            }));
            setCustomSkill('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createSubscriber.mutateAsync(formData);
            setSuccess(true);
            setFormData({ name: '', email: '', skills: [] });

            // Reset success message after 5s
            setTimeout(() => setSuccess(false), 5000);
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Navigation />

            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <Bell className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-stone-900 mb-4">
                        Nhận thông báo việc làm mới
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Đăng ký để nhận email thông báo ngay khi có công việc mới phù hợp với kỹ năng của bạn
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-green-900">Đăng ký thành công!</h3>
                            <p className="text-green-700 text-sm mt-1">
                                Chúng tôi sẽ gửi email thông báo khi có việc làm phù hợp với bạn.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                                <User className="w-4 h-4" />
                                Họ và tên *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                                <Mail className="w-4 h-4" />
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
                                <Tag className="w-4 h-4" />
                                Kỹ năng quan tâm * (Chọn ít nhất 1)
                            </label>

                            {/* Common Skills */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                {COMMON_SKILLS.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => handleToggleSkill(skill)}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${formData.skills.includes(skill)
                                                ? 'border-red-600 bg-red-50 text-red-700'
                                                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Skill Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customSkill}
                                    onChange={(e) => setCustomSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
                                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Thêm kỹ năng khác..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCustomSkill}
                                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors"
                                >
                                    Thêm
                                </button>
                            </div>

                            {/* Selected Skills */}
                            {formData.skills.length > 0 && (
                                <div className="mt-4 p-4 bg-stone-50 rounded-lg">
                                    <p className="text-sm text-stone-600 mb-2">
                                        Đã chọn {formData.skills.length} kỹ năng:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleSkill(skill)}
                                                    className="hover:bg-red-200 rounded-full p-0.5"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={createSubscriber.isPending || formData.skills.length === 0}
                            className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {createSubscriber.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                <>
                                    <Bell className="w-5 h-5" />
                                    Đăng ký nhận thông báo
                                </>
                            )}
                        </button>

                        <p className="text-sm text-stone-500 text-center">
                            Bằng cách đăng ký, bạn đồng ý nhận email thông báo việc làm từ JobPortal
                        </p>
                    </form>
                </div>

                {/* Benefits */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-stone-900 mb-2">Thông báo tức thì</h3>
                        <p className="text-sm text-stone-600">
                            Nhận email ngay khi có việc làm mới phù hợp
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Tag className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-stone-900 mb-2">Tùy chỉnh kỹ năng</h3>
                        <p className="text-sm text-stone-600">
                            Chọn kỹ năng bạn quan tâm để nhận thông báo chính xác
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-stone-900 mb-2">Miễn phí 100%</h3>
                        <p className="text-sm text-stone-600">
                            Hoàn toàn miễn phí, không giới hạn số lượng thông báo
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
