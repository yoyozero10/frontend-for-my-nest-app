import { useState } from 'react';
import { useAllSubscribers, useDeleteSubscriber } from '../../../hooks/subscribers.hooks';
import { Loader2, Mail, Tag, Trash2, Search, Users } from 'lucide-react';
import type { Subscriber } from '../../../services/subscribers.api';

export default function AdminSubscribersPage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading, isError } = useAllSubscribers(page, 20);
    const deleteSubscriber = useDeleteSubscriber();

    // Extract subscribers from response
    const allSubscribers: Subscriber[] = data?.data?.data?.result || [];
    const meta = data?.data?.data?.meta || { total: 0, pages: 1 };

    // Filter by search
    const subscribers = allSubscribers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (id: string, email: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa subscriber "${email}"?`)) {
            try {
                await deleteSubscriber.mutateAsync(id);
            } catch (error) {
                console.error('Error deleting subscriber:', error);
            }
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
                <p className="text-red-800 font-medium">Không thể tải danh sách subscribers</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Quản lý Subscribers</h2>
                    <p className="text-stone-600 mt-1">
                        Danh sách người đăng ký nhận thông báo ({meta.total} subscribers)
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm theo tên, email hoặc skill..."
                    className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-stone-700">Subscriber</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-stone-700">Skills</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-stone-700">Ngày đăng ký</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-stone-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-stone-500">
                                    {searchTerm ? 'Không tìm thấy subscriber nào' : 'Chưa có subscriber nào'}
                                </td>
                            </tr>
                        ) : (
                            subscribers.map((subscriber) => (
                                <tr key={subscriber._id} className="hover:bg-stone-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Users className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-stone-900">{subscriber.name}</p>
                                                <p className="text-sm text-stone-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {subscriber.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-md">
                                            {subscriber.skills.slice(0, 5).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {skill}
                                                </span>
                                            ))}
                                            {subscriber.skills.length > 5 && (
                                                <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs font-medium">
                                                    +{subscriber.skills.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-600">
                                        {subscriber.createdAt
                                            ? new Date(subscriber.createdAt).toLocaleDateString('vi-VN')
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(subscriber._id, subscriber.email)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa"
                                                disabled={deleteSubscriber.isPending}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2 text-stone-600">
                        Trang {page} / {meta.pages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                        disabled={page === meta.pages}
                        className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}
