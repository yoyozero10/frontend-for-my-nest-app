import { useState } from 'react';
import { useAllResumes, useUpdateResumeStatus } from '../../../hooks/resumes.hooks';
import { useNavigate } from 'react-router-dom';
import { Loader2, ExternalLink, Briefcase, Building2, Calendar, User } from 'lucide-react';

export default function AdminResumesPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const pageSize = 10;

    const { data, isLoading, isError } = useAllResumes(page, pageSize, statusFilter);
    const updateStatus = useUpdateResumeStatus();

    const resumes = data?.data?.data?.result || [];
    const totalPages = data?.data?.data?.meta?.pages || 1;

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateStatus.mutateAsync({ id, status: newStatus });
            alert('Cập nhật status thành công!');
        } catch (error) {
            alert('Cập nhật status thất bại!');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-700' },
            REVIEWING: { label: 'Đang xem xét', className: 'bg-blue-100 text-blue-700' },
            APPROVED: { label: 'Được chấp nhận', className: 'bg-green-100 text-green-700' },
            REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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
                <p className="text-red-800 font-medium">Không thể tải danh sách resumes</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Resumes Review</h2>
                <p className="text-stone-600 mt-1">Xem xét và duyệt hồ sơ ứng tuyển</p>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-stone-700">Filter by Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Đang chờ</option>
                        <option value="REVIEWING">Đang xem xét</option>
                        <option value="APPROVED">Được chấp nhận</option>
                        <option value="REJECTED">Bị từ chối</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-stone-600 mb-1">Tổng hồ sơ</p>
                    <p className="text-2xl font-bold text-stone-900">{resumes.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-stone-600 mb-1">Đang chờ</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {resumes.filter((r: any) => r.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-stone-600 mb-1">Đang xem xét</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {resumes.filter((r: any) => r.status === 'REVIEWING').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-stone-600 mb-1">Được chấp nhận</p>
                    <p className="text-2xl font-bold text-green-600">
                        {resumes.filter((r: any) => r.status === 'APPROVED').length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Candidate</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Job</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Company</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Applied Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {resumes.map((resume: any) => (
                                <tr key={resume._id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-stone-400" />
                                            <span className="text-sm text-stone-900">{resume.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-stone-400" />
                                            <button
                                                onClick={() => navigate(`/jobs/${resume.jobId?._id}`)}
                                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                {resume.jobId?.name || 'N/A'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-stone-400" />
                                            <span className="text-sm text-stone-600">{resume.companyId?.name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-stone-400" />
                                            <span className="text-sm text-stone-600">{formatDate(resume.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(resume.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={resume.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                View CV
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                            <select
                                                value={resume.status}
                                                onChange={(e) => handleStatusChange(resume._id, e.target.value)}
                                                className="text-sm px-2 py-1 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                                disabled={updateStatus.isPending}
                                            >
                                                <option value="PENDING">Đang chờ</option>
                                                <option value="REVIEWING">Đang xem xét</option>
                                                <option value="APPROVED">Chấp nhận</option>
                                                <option value="REJECTED">Từ chối</option>
                                            </select>
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

                {/* Empty State */}
                {resumes.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-stone-500">Không có hồ sơ nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}
