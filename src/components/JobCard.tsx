import { Star } from 'lucide-react';

interface JobCardProps {
    id: string;
    company: string;
    location: string;
    rating: number;
    distance?: string;
    image: string;
    tags: string[];
    workload: string;
}

export default function JobCard({
    company,
    location,
    rating,
    distance,
    image,
    tags,
    workload,
}: JobCardProps) {
    return (
        <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:shadow-stone-200/50 hover:border-stone-300 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={company}
                    className="group-hover:scale-105 transition-transform duration-500 w-full h-full object-cover"
                />
                {distance && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-stone-900 border border-white/50">
                        {distance}
                    </div>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-stone-900 group-hover:text-red-600 transition-colors">
                            {company}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">{location}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-100">
                        <span className="text-xs font-bold">{rating}</span>
                        <Star className="w-3 h-3 fill-red-600 text-red-600" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] uppercase tracking-wider font-medium rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-2">
                    <span className="text-xs font-mono text-stone-400">{workload}</span>
                    <button className="text-sm font-medium text-stone-900 hover:text-red-600 transition-colors">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}
