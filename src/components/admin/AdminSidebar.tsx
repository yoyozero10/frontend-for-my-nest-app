import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Building2, FileText, Users } from 'lucide-react';

export default function AdminSidebar() {
    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/admin'
        },
        {
            icon: Briefcase,
            label: 'Jobs',
            path: '/admin/jobs'
        },
        {
            icon: Building2,
            label: 'Companies',
            path: '/admin/companies'
        },
        {
            icon: FileText,
            label: 'Resumes',
            path: '/admin/resumes'
        },
        {
            icon: Users,
            label: 'Users',
            path: '/admin/users'
        }
    ];

    return (
        <aside className="w-64 bg-stone-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-stone-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 flex items-center justify-center font-bold text-lg">
                        J
                    </div>
                    <div>
                        <p className="font-semibold">JOBPORTAL</p>
                        <p className="text-xs text-stone-400">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-red-600 text-white'
                                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-stone-800">
                <p className="text-xs text-stone-500 text-center">
                    © 2026 JobPortal Admin
                </p>
            </div>
        </aside>
    );
}
