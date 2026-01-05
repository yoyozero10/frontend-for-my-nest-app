import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Job } from '../types/job';

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    // Format salary
    const formatSalary = (salary: number) => {
        if (salary >= 1000000) {
            return `${(salary / 1000000).toFixed(0)}M VNĐ`;
        }
        return `${(salary / 1000).toFixed(0)}K VNĐ`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Placeholder image nếu không có logo
    const companyImage = job.company.logo ||
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';

    return (
        <Link
            to={`/jobs/${job._id}`}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:shadow-stone-200/50 hover:border-stone-300 transition-all duration-300 block"
        >
            <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                    src={companyImage}
                    alt={job.company.name}
                    className="group-hover:scale-105 transition-transform duration-500 w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback nếu ảnh lỗi
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
                    }}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-stone-900 border border-white/50">
                    {job.level}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <h3 className="font-semibold text-stone-900 group-hover:text-red-600 transition-colors line-clamp-1">
                            {job.name}
                        </h3>
                        <p className="text-sm text-stone-600 mt-1 font-medium">
                            {job.company.name}
                        </p>
                    </div>
                </div>

                {/* Location & Salary */}
                <div className="space-y-2 mt-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold text-red-600">{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span>{job.quantity} vị trí</span>
                    </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] uppercase tracking-wider font-medium rounded-md"
                        >
                            {skill}
                        </span>
                    ))}
                    {job.skills.length > 3 && (
                        <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] uppercase tracking-wider font-medium rounded-md">
                            +{job.skills.length - 3}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-2">
                    <span className="text-xs font-mono text-stone-400">
                        Hạn: {formatDate(job.endDate)}
                    </span>
                    <span className="text-sm font-medium text-stone-900 group-hover:text-red-600 transition-colors">
                        Xem chi tiết →
                    </span>
                </div>
            </div>
        </Link>
    );
}
