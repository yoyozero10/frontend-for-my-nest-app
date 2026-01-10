import { useState } from 'react';
import { useAllPermissions, useCreatePermission, useUpdatePermission, useDeletePermission } from '../../../hooks/permissions.hooks';
import { Loader2, Plus, Edit, Trash2, Key, Search } from 'lucide-react';
import type { Permission, CreatePermissionDto, UpdatePermissionDto } from '../../../services/permissions.api';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
const MODULES = ['AUTH', 'USERS', 'JOBS', 'COMPANIES', 'RESUMES', 'ROLES', 'PERMISSIONS', 'FILES', 'SUBSCRIBERS'] as const;

const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
        GET: 'bg-green-100 text-green-700',
        POST: 'bg-blue-100 text-blue-700',
        PUT: 'bg-yellow-100 text-yellow-700',
        PATCH: 'bg-orange-100 text-orange-700',
        DELETE: 'bg-red-100 text-red-700',
    };
    return colors[method] || 'bg-stone-100 text-stone-700';
};

export default function AdminPermissionsPage() {
    const [page] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<CreatePermissionDto>({
        name: '',
        apiPath: '',
        method: 'GET',
        module: 'USERS'
    });

    const { data, isLoading, isError } = useAllPermissions(page, 50);
    const createPermission = useCreatePermission();
    const updatePermission = useUpdatePermission();
    const deletePermission = useDeletePermission();

    // Extract permissions from response
    const allPermissions: Permission[] = data?.data?.data?.result || [];
    const meta = data?.data?.data?.meta || { total: 0, pages: 1 };

    // Filter permissions by search term
    const permissions = allPermissions.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.apiPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingPermission(null);
        setFormData({ name: '', apiPath: '', method: 'GET', module: 'USERS' });
        setShowModal(true);
    };

    const handleOpenEdit = (permission: Permission) => {
        setEditingPermission(permission);
        setFormData({
            name: permission.name,
            apiPath: permission.apiPath,
            method: permission.method,
            module: permission.module
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingPermission) {
                await updatePermission.mutateAsync({
                    id: editingPermission._id,
                    data: formData as UpdatePermissionDto
                });
            } else {
                await createPermission.mutateAsync(formData);
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving permission:', error);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa permission "${name}"?`)) {
            try {
                await deletePermission.mutateAsync(id);
            } catch (error) {
                console.error('Error deleting permission:', error);
            }
        }
    };

    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module || 'OTHER';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

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
                <p className="text-red-800 font-medium">Không thể tải danh sách permissions</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Quản lý Permissions</h2>
                    <p className="text-stone-600 mt-1">
                        Quản lý quyền truy cập API ({meta.total} permissions)
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Permission
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm permission..."
                    className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
            </div>

            {/* Permissions grouped by module */}
            <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                    <div key={module} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200">
                            <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                                <Key className="w-4 h-4 text-purple-600" />
                                {module}
                                <span className="text-sm font-normal text-stone-500">
                                    ({modulePermissions.length})
                                </span>
                            </h3>
                        </div>
                        <div className="divide-y divide-stone-200">
                            {modulePermissions.map((permission) => (
                                <div key={permission._id} className="px-6 py-3 flex items-center justify-between hover:bg-stone-50">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(permission.method)}`}>
                                            {permission.method}
                                        </span>
                                        <div>
                                            <p className="font-medium text-stone-900">{permission.name}</p>
                                            <p className="text-sm text-stone-500 font-mono">{permission.apiPath}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(permission)}
                                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                                            title="Sửa"
                                        >
                                            <Edit className="w-4 h-4 text-stone-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(permission._id, permission.name)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {permissions.length === 0 && (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                    <Key className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500">Không tìm thấy permission nào</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
                        <h3 className="text-xl font-bold text-stone-900 mb-4">
                            {editingPermission ? 'Sửa Permission' : 'Thêm Permission Mới'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Tên Permission *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="VD: CREATE_USER, DELETE_JOB"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    API Path *
                                </label>
                                <input
                                    type="text"
                                    value={formData.apiPath}
                                    onChange={(e) => setFormData({ ...formData, apiPath: e.target.value })}
                                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                                    placeholder="VD: /api/v1/users"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        Method *
                                    </label>
                                    <select
                                        value={formData.method}
                                        onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        required
                                    >
                                        {HTTP_METHODS.map(method => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        Module *
                                    </label>
                                    <select
                                        value={formData.module}
                                        onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        required
                                    >
                                        {MODULES.map(module => (
                                            <option key={module} value={module}>{module}</option>
                                        ))}
                                    </select>
                                </div>
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
                                    disabled={createPermission.isPending || updatePermission.isPending}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
                                >
                                    {createPermission.isPending || updatePermission.isPending ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
