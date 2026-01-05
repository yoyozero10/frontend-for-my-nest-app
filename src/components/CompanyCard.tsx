import { MapPin, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Company } from '../types/company';

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    // Placeholder image nếu không có logo
    const companyLogo = company.logo ||
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';

    return (
        <Link
            to={`/companies/${company._id}`}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:shadow-stone-200/50 hover:border-stone-300 transition-all duration-300 block"
        >
            <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                    src={companyLogo}
                    alt={company.name}
                    className="group-hover:scale-105 transition-transform duration-500 w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback nếu ảnh lỗi
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-semibold text-white text-lg group-hover:text-red-400 transition-colors line-clamp-1">
                        {company.name}
                    </h3>
                </div>
            </div>

            <div className="p-5">
                {/* Address */}
                <div className="flex items-center gap-2 text-sm text-stone-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{company.address}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {company.description}
                </p>

                <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-2">
                    <div className="flex items-center gap-2 text-stone-400">
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Công ty</span>
                    </div>
                    <span className="text-sm font-medium text-stone-900 group-hover:text-red-600 transition-colors">
                        Xem chi tiết →
                    </span>
                </div>
            </div>
        </Link>
    );
}
