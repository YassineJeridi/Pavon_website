// frontend/src/components/dashboard/categories/CategorySearch.jsx

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const CategorySearch = ({ searchQuery, setSearchQuery, onCreateNew }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="flex-1 relative w-full">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une catégorie par nom..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all"
                    />
                </div>

                {/* Create Button */}
                <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#5d1115] to-[#7d1519] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all font-semibold whitespace-nowrap"
                >
                    <PlusIcon className="w-5 h-5" />
                    Nouvelle catégorie
                </button>
            </div>
        </div>
    );
};

export default CategorySearch;
