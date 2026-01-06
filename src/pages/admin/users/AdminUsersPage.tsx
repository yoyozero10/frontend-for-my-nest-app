import { useState } from 'react';
import { useAllUsers, useUpdateUser, useDeleteUser } from '../../../hooks/users.hooks';
import { Loader2, Trash2, Shield, Mail, Calendar } from 'lucide-react';

export default function AdminUsersPage() {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isError } = useAllUsers(page, pageSize);
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    const users = data?.data?.data?.result || [];
    const totalPages = data?.data?.data?.meta?.pages || 1;

    // Debug: Log để xem structure
    console.log('Users data:', users);
    if (users.length > 0) {
        console.log('First user:', users[0]);
        console.log('First user role:', users[0].role);
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUser.mutateAsync({ _id: userId, role: newRole });
            alert('Cập nhật role thành công!');
        } catch (error) {
            alert('Cập nhật role thất bại!');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa user "${name}"?`)) return;

        try {
            await deleteUser.mutateAsync(id);
            alert('Xóa user thành công!');
        } catch (error) {
            alert('Xóa user thất bại!');
        }
    };

    const getRoleBadge = (roleName: string) => {
        const roleConfig = {
            ADMIN: { className: 'bg-red-100 text-red-700' },
            HR: { className: 'bg-blue-100 text-blue-700' },
            USER: { className: 'bg-green-100 text-green-700' }
        };

        const config = roleConfig[roleName as keyof typeof roleConfig] || roleConfig.USER;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
                {roleName}
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
                <p className="text-red-800 font-medium">Không thể tải danh sách users</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Users Management</h2>
                <p className="text-stone-600 mt-1">Quản lý người dùng và phân quyền</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-stone-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-stone-900">{users.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-stone-600 mb-1">Admins</p>
                    <p className="text-2xl font-bold text-red-600">
                        {users.filter((u: any) => u.role?.name === 'ADMIN').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-stone-600 mb-1">Regular Users</p>
                    <p className="text-2xl font-bold text-green-600">
                        {users.filter((u: any) => u.role?.name === 'USER').length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Created Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-stone-900">{user.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-stone-400" />
                                            <span className="text-sm text-stone-600">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-stone-400" />
                                            {getRoleBadge(user.role?.name || 'USER')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-stone-400" />
                                            <span className="text-sm text-stone-600">
                                                {formatDate(user.createdAt)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={user.role?.name || ''}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="text-sm px-2 py-1 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                                disabled={updateUser.isPending}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="HR">HR</option>
                                                <option value="USER">USER</option>
                                            </select>
                                            <button
                                                onClick={() => handleDelete(user._id, user.name)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                                disabled={deleteUser.isPending}
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

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-stone-500">Không có user nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}
