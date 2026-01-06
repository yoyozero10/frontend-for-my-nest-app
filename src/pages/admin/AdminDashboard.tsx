import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, FileText, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const stats = [
        {
            icon: Briefcase,
            label: 'Total Jobs',
            value: '24',
            color: 'bg-blue-500',
            link: '/admin/jobs'
        },
        {
            icon: Building2,
            label: 'Companies',
            value: '5',
            color: 'bg-green-500',
            link: '/admin/companies'
        },
        {
            icon: FileText,
            label: 'Resumes',
            value: '12',
            color: 'bg-yellow-500',
            link: '/admin/resumes'
        },
        {
            icon: Users,
            label: 'Users',
            value: '8',
            color: 'bg-purple-500',
            link: '/admin/users'
        }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        onClick={() => navigate(stat.link)}
                        className="bg-white rounded-xl border border-stone-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${stat.color} rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-stone-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/admin/jobs/create')}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        + Create New Job
                    </button>
                    <button
                        onClick={() => navigate('/admin/companies/create')}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        + Add Company
                    </button>
                    <button
                        onClick={() => navigate('/admin/resumes')}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Review Resumes
                    </button>
                </div>
            </div>
        </div>
    );
}
