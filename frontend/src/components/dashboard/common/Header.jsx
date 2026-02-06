// frontend/src/components/dashboard/common/Header.jsx

import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/dashboard/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {admin?.name || 'Admin'}
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-700">{admin?.email}</p>
            <p className="text-xs text-gray-500">{admin?.role}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
