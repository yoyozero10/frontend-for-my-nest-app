import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCompany } from '../../../hooks/useCompanies';
import { ArrowLeft, Loader2 } from 'lucide-react';
import FileUpload from '../../../components/FileUpload';
import type { CreateCompanyDto } from '../../../types/company';

export default function CreateCompanyPage() {
    const navigate = useNavigate();
    const createCompany = useCreateCompany();

    const [formData, setFormData] = useState<CreateCompanyDto>({
        name: '',
        address: '',
        description: '',
        logo: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.description) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            await createCompany.mutateAsync(formData);
            alert('Tạo company thành công!');
            navigate('/admin/companies');
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Tạo company thất bại!');
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/companies')}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Add New Company</h2>
                    <p className="text-stone-600 mt-1">Thêm công ty mới vào hệ thống</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Company Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="e.g. FPT Software"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Address <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="e.g. Hà Nội, Việt Nam"
                            required
                        />
                    </div>

                    {/* Logo Upload */}
                    <div className="md:col-span-2">
                        <FileUpload
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, logo: url }))}
                            accept="image/*"
                            maxSize={2}
                            label="Upload Logo (Optional)"
                            currentFile={formData.logo}
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Description <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows={6}
                            placeholder="Company description..."
                            required
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-stone-200">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/companies')}
                        className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={createCompany.isPending}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        {createCompany.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {createCompany.isPending ? 'Creating...' : 'Create Company'}
                    </button>
                </div>
            </form>
        </div>
    );
}
