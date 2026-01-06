import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateCompany, useCompany } from '../../../hooks/useCompanies';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { UpdateCompanyDto } from '../../../types/company';

export default function EditCompanyPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const updateCompany = useUpdateCompany();
    const { data: companyData, isLoading: loadingCompany } = useCompany(id!);

    const company = companyData?.data;

    const [formData, setFormData] = useState<UpdateCompanyDto>({
        _id: id!,
        name: '',
        address: '',
        description: '',
        logo: ''
    });

    // Load company data when available
    useEffect(() => {
        if (company) {
            setFormData({
                _id: company._id,
                name: company.name,
                address: company.address,
                description: company.description,
                logo: company.logo || ''
            });
        }
    }, [company]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.description) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            await updateCompany.mutateAsync(formData);
            alert('Cập nhật company thành công!');
            navigate('/admin/companies');
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Cập nhật company thất bại!');
        }
    };

    if (loadingCompany) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <span className="ml-3 text-stone-600">Đang tải...</span>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <p className="text-red-800 font-medium">Company not found</p>
            </div>
        );
    }

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
                    <h2 className="text-2xl font-bold text-stone-900">Edit Company</h2>
                    <p className="text-stone-600 mt-1">Chỉnh sửa thông tin công ty</p>
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
                            required
                        />
                    </div>

                    {/* Logo URL */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Logo URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={formData.logo}
                            onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        disabled={updateCompany.isPending}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        {updateCompany.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {updateCompany.isPending ? 'Updating...' : 'Update Company'}
                    </button>
                </div>
            </form>
        </div>
    );
}
