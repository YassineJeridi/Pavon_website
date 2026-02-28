// frontend/src/components/dashboard/categories/CategoryGrid.jsx

import { PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

const CategoryGrid = ({ categories, onEdit, onDelete }) => {
    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
                <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Aucune catégorie trouvée</p>
                <p className="text-gray-400 text-sm mt-1">Créez votre première catégorie pour commencer</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
                <div
                    key={category._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col"
                >
                    {/* Image - Fixed aspect ratio */}
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex-shrink-0">
                        {category.image ? (
                            <img
                                src={category.image.startsWith('http') ? category.image : `${(import.meta.env.VITE_API_URL || 'https://backend.pavonecollection.com/api').replace(/\/api$/, '')}${category.image}`}
                                alt={category.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <PhotoIcon className="w-16 h-16 text-gray-300" />
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${category.isActive || category.active
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-500 text-white'
                                    }`}
                            >
                                {category.isActive || category.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    {/* Content - Fixed height */}
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 truncate">
                            <span className="font-medium">Slug:</span> {category.slug}
                        </p>
                        <div className="h-10 mb-3 flex-grow-0">
                            {category.description && (
                                <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                            )}
                        </div>

                        {/* Actions - Always at bottom */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100 mt-auto">
                            <button
                                onClick={() => onEdit(category)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#fdf9ee] text-[#5d1115] rounded-lg hover:bg-[#e8ddca] transition-colors font-medium"
                            >
                                <PencilIcon className="w-4 h-4" />
                                Modifier
                            </button>
                            <button
                                onClick={() => onDelete(category._id)}
                                className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryGrid;
