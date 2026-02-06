// frontend/src/components/dashboard/common/Sidebar.jsx

import { Link, useLocation } from 'react-router-dom';
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
  MegaphoneIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Products', path: '/dashboard/products', icon: ShoppingBagIcon },
    { name: 'Orders', path: '/dashboard/orders', icon: TruckIcon },
    { name: 'Banners', path: '/dashboard/banners', icon: PhotoIcon },
    { name: 'Top Banner', path: '/dashboard/top-banner', icon: MegaphoneIcon },
    { name: 'Collections', path: '/dashboard/collections', icon: FolderIcon },
    { name: 'Categories', path: '/dashboard/categories', icon: TagIcon },
    { name: 'Contacts', path: '/dashboard/contacts', icon: EnvelopeIcon },
    { name: 'Testimonials', path: '/dashboard/testimonials', icon: StarIcon },

  ];

  const isActive = (path) => location.pathname === path;

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
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111f35] text-white transition-transform duration-300 ease-in-out`}
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
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm transition-colors ${active
                    ? 'bg-gray-800 text-white border-l-4 border-[#5d1115]'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
