import { useState } from 'react';
import { useAllRoles, useCreateRole, useUpdateRole, useDeleteRole } from '../../../hooks/roles.hooks';
import { Loader2, Plus, Edit, Trash2, Shield, Check, X } from 'lucide-react';
import type { Role, CreateRoleDto, UpdateRoleDto } from '../../../services/roles.api';

export default function AdminRolesPage() {
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState<CreateRoleDto>({
        name: '',
        description: '',
        isActive: true,
        permissions: []
    });

    const { data, isLoading, isError } = useAllRoles(page, 10);
    const createRole = useCreateRole();
    const updateRole = useUpdateRole();
    const deleteRole = useDeleteRole();

    // Extract roles from response
    const roles: Role[] = data?.data?.data?.result || [];
    const meta = data?.data?.data?.meta || { total: 0, pages: 1 };

    const handleOpenCreate = () => {
        setEditingRole(null);
        setFormData({ name: '', description: '', isActive: true, permissions: [] });
        setShowModal(true);
    };

    const handleOpenEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description,
            isActive: role.isActive,
            permissions: role.permissions?.map(p => p._id) || []
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingRole) {
                await updateRole.mutateAsync({
                    id: editingRole._id,
                    data: formData as UpdateRoleDto
                });
            } else {
                await createRole.mutateAsync(formData);
            }
            setShowModal(false);
            setFormData({ name: '', description: '', isActive: true, permissions: [] });
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa role "${name}"?`)) {
            try {
                await deleteRole.mutateAsync(id);
            } catch (error) {
                console.error('Error deleting role:', error);
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
                <p className="text-red-800 font-medium">Không thể tải danh sách roles</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Quản lý Roles</h2>
                    <p className="text-stone-600 mt-1">Quản lý các vai trò trong hệ thống</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Role
                </button>
            </div>

            {/* Roles Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-stone-700">Tên Role</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-stone-700">Mô tả</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-stone-700">Trạng thái</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-stone-700">Permissions</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-stone-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                        {roles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                                    Chưa có role nào
                                </td>
                            </tr>
                        ) : (
                            roles.map((role) => (
                                <tr key={role._id} className="hover:bg-stone-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Shield className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <span className="font-medium text-stone-900">{role.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-stone-600 max-w-xs truncate">
                                        {role.description || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {role.isActive ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                <Check className="w-3 h-3" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                <X className="w-3 h-3" />
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            {role.permissions?.length || 0} permissions
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(role)}
                                                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                                                title="Sửa"
                                            >
                                                <Edit className="w-4 h-4 text-stone-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(role._id, role.name)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa"
                                                disabled={deleteRole.isPending}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
                        <h3 className="text-xl font-bold text-stone-900 mb-4">
                            {editingRole ? 'Sửa Role' : 'Thêm Role Mới'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Tên Role *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="VD: SUPER_ADMIN, HR, USER"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Mô tả vai trò..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-red-600 border-stone-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="isActive" className="text-sm text-stone-700">
                                    Kích hoạt role này
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createRole.isPending || updateRole.isPending}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
                                >
                                    {createRole.isPending || updateRole.isPending ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
