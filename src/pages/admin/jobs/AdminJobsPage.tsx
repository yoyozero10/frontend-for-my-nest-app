import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs, useDeleteJob } from '../../../hooks/useJobs';
import { Loader2, Plus, Pencil, Trash2, Eye } from 'lucide-react';

export default function AdminJobsPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isError } = useJobs(page, pageSize);
    const deleteJob = useDeleteJob();

    const jobs = data?.data?.result || [];
    const totalPages = data?.data?.meta?.pages || 1;

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa job "${name}"?`)) return;

        try {
            await deleteJob.mutateAsync(id);
            alert('Xóa job thành công!');
        } catch (error) {
            alert('Xóa job thất bại!');
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
                <p className="text-red-800 font-medium">Không thể tải danh sách jobs</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Jobs Management</h2>
                    <p className="text-stone-600 mt-1">Quản lý tất cả công việc</p>
                </div>
                <button
                    onClick={() => navigate('/admin/jobs/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create New Job
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Job Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Company</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Level</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Salary</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-stone-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {jobs.map((job: any) => (
                                <tr key={job._id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-stone-900">{job.name}</p>
                                    </td>
                                    <td className="px-6 py-4 text-stone-600">{job.company?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-stone-600">{job.location}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                            {job.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-stone-600">
                                        {(job.salary / 1000000).toFixed(0)}M VNĐ
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${job.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {job.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/jobs/${job._id}`)}
                                                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4 text-stone-600" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(job._id, job.name)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                                disabled={deleteJob.isPending}
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
