// frontend/src/components/dashboard/common/Sidebar.jsx

import { Link, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  TruckIcon,
  PhotoIcon,
  FolderIcon,
  TagIcon,
  EnvelopeIcon,
  StarIcon,
  ChartBarIcon,
  XMarkIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  KeyIcon,
  UserPlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { admin } = useContext(AuthContext);
  const isSuperAdmin = admin?.role === 'super_admin';
  
  // State for each collapsible group
  const [openGroups, setOpenGroups] = useState({
    orders: true,
    catalog: true,
    content: true,
    settings: false,
  });

  // Toggle group open/close
  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  // Menu structure with groups
  const menuStructure = [
    // Single item - Dashboard
    {
      type: 'single',
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: HomeIcon,
    },
    // Group 1: Ventes
    {
      type: 'group',
      key: 'orders',
      name: 'Ventes',
      icon: TruckIcon,
      items: [
        { name: 'Commandes Site', path: '/dashboard/orders', icon: TruckIcon },
        { name: 'Commandes Externes', path: '/dashboard/external-orders', icon: GlobeAltIcon },
        { name: 'Stats & Dépenses', path: '/dashboard/financials', icon: CurrencyDollarIcon },
      ],
    },
    // Group 2: Catalogue
    {
      type: 'group',
      key: 'catalog',
      name: 'Catalogue',
      icon: FolderIcon,
      items: [
        { name: 'Collections', path: '/dashboard/collections', icon: FolderIcon },
        { name: 'Catégories', path: '/dashboard/categories', icon: TagIcon },
        { name: 'Produits', path: '/dashboard/products', icon: ShoppingBagIcon },
        { name: 'Stock', path: '/dashboard/stock', icon: ArchiveBoxIcon },
      ],
    },
    // Group 3: Contenu du Site
    {
      type: 'group',
      key: 'content',
      name: 'Contenu du Site',
      icon: PhotoIcon,
      items: [
        { name: 'Bannière Supérieure', path: '/dashboard/top-banner', icon: MegaphoneIcon },
        { name: 'Bannières Principales', path: '/dashboard/banners', icon: PhotoIcon },
        { name: 'Témoignages', path: '/dashboard/testimonials', icon: StarIcon },
        { name: 'Messages Contact', path: '/dashboard/contacts', icon: EnvelopeIcon },
      ],
    },
    // Group 4: Paramètres
    {
      type: 'group',
      key: 'settings',
      name: 'Paramètres',
      icon: Cog6ToothIcon,
      items: [
        { name: 'Changer le mot de passe', path: '/dashboard/settings', icon: KeyIcon },
        ...(isSuperAdmin ? [
          { name: 'Créer un admin', path: '/dashboard/settings/create', icon: UserPlusIcon },
          { name: 'Gérer les admins', path: '/dashboard/settings/manage', icon: UsersIcon },
        ] : []),
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (items) => items?.some(item => location.pathname === item.path);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111f35] text-white transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h1 className="text-2xl font-playfair font-bold">Admin Panel</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 pb-6">
          {menuStructure.map((item, index) => {
            // Render single items (like Dashboard)
            if (item.type === 'single') {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white border-l-4 border-indigo-500 shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            }

            // Render groups with collapsible items
            if (item.type === 'group') {
              const Icon = item.icon;
              const isOpen = openGroups[item.key];
              const groupActive = isGroupActive(item.items);

              return (
                <div key={item.key} className="mt-4">
                  {/* Group Header */}
                  <div className="px-6 mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {item.name}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleGroup(item.key)}
                    className={`flex items-center justify-between w-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                      groupActive
                        ? 'bg-slate-800/30 text-white'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.name}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>

                  {/* Group Items */}
                  {isOpen && (
                    <div className="bg-slate-900/30 backdrop-blur-sm">
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subActive = isActive(subItem.path);
                        
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-6 py-2.5 pl-14 text-sm font-medium transition-all duration-200 ${
                              subActive
                                ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white border-l-4 border-indigo-500 shadow-md'
                                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 mr-2" />}
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
