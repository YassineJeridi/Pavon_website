// frontend/src/components/dashboard/categories/CategoryStats.jsx

import { RectangleGroupIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const CategoryStats = ({ totalCategories, activeCount, inactiveCount }) => {
    const stats = [
        {
            label: 'Total',
            value: totalCategories,
            icon: RectangleGroupIcon,
            color: 'from-[#5d1115] to-[#7d1519]',
            textColor: 'text-[#5d1115]',
            bgColor: 'bg-[#fdf9ee]',
        },
        {
            label: 'Actives',
            value: activeCount,
            icon: EyeIcon,
            color: 'from-green-600 to-green-700',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Inactives',
            value: inactiveCount,
            icon: EyeSlashIcon,
            color: 'from-gray-600 to-gray-700',
            textColor: 'text-gray-600',
            bgColor: 'bg-gray-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                            </div>
                            <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                <Icon className={`w-7 h-7 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryStats;
