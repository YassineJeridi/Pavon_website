// frontend/src/components/dashboard/contacts/ContactFilters.jsx

import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const ContactFilters = ({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all bg-white"
                    >
                        <option value="all">Tous les messages</option>
                        <option value="unread">Non lus</option>
                        <option value="read">Lus</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ContactFilters;
