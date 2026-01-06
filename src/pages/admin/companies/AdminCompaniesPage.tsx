import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies, useDeleteCompany } from '../../../hooks/useCompanies';
import { Loader2, Plus, Pencil, Trash2, Eye } from 'lucide-react';

export default function AdminCompaniesPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isError } = useCompanies(page, pageSize);
    const deleteCompany = useDeleteCompany();

    const companies = data?.data?.result || [];
    const totalPages = data?.data?.meta?.pages || 1;

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa company "${name}"?`)) return;

        try {
            await deleteCompany.mutateAsync(id);
            alert('Xóa company thành công!');
        } catch (error) {
            alert('Xóa company thất bại!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <span className="ml-3 text-stone-600">Đang tải...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <p className="text-red-800 font-medium">Không thể tải danh sách companies</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Companies Management</h2>
                    <p className="text-stone-600 mt-1">Quản lý tất cả công ty</p>
                </div>
                <button
                    onClick={() => navigate('/admin/companies/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Company
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Company Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Address</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Description</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-stone-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {companies.map((company: any) => (
                                <tr key={company._id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {company.logo && (
                                                <img
                                                    src={company.logo}
                                                    alt={company.name}
                                                    className="w-10 h-10 rounded object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <p className="font-medium text-stone-900">{company.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-stone-600">{company.address}</td>
                                    <td className="px-6 py-4 text-stone-600">
                                        <p className="line-clamp-2 max-w-md">{company.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/companies/${company._id}`)}
                                                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4 text-stone-600" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/companies/edit/${company._id}`)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company._id, company.name)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                                disabled={deleteCompany.isPending}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
                        <p className="text-sm text-stone-600">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
