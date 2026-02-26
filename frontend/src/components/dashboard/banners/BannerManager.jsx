// frontend/src/components/dashboard/banners/BannerManager.jsx

import { useState, useEffect } from 'react';
import bannerService from '../../../services/bannerService';
import BannerUpload from './BannerUpload';
import { TrashIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAllBanners();
      console.log('📦 Banners API response:', data);
      
      // ✅ FIXED: Handle multiple response formats
      let bannersArray = [];
      if (Array.isArray(data)) {
        bannersArray = data;
      } else if (data.banners && Array.isArray(data.banners)) {
        bannersArray = data.banners;
      } else if (data.data && Array.isArray(data.data)) {
        bannersArray = data.data;
      }
      
      setBanners(bannersArray);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]); // ✅ FIXED: Always set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      return;
    }

    try {
      await bannerService.deleteBanner(bannerId);
      setBanners(banners.filter(b => b._id !== bannerId));
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const updated = await bannerService.updateBanner(banner._id, {
        ...banner,
        active: !banner.active,
      });
      
      // Handle response format
      const updatedBanner = updated.banner || updated.data || updated;
      setBanners(banners.map(b => b._id === banner._id ? updatedBanner : b));
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleMoveUp = async (banner, index) => {
    if (index === 0) return;

    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];

    try {
      await Promise.all(
        newBanners.map((b, i) =>
          bannerService.updateBanner(b._id, { ...b, order: i })
        )
      );
      setBanners(newBanners);
    } catch (error) {
      console.error('Error reordering banners:', error);
    }
  };

  const handleMoveDown = async (banner, index) => {
    if (index === banners.length - 1) return;

    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];

    try {
      await Promise.all(
        newBanners.map((b, i) =>
          bannerService.updateBanner(b._id, { ...b, order: i })
        )
      );
      setBanners(newBanners);
    } catch (error) {
      console.error('Error reordering banners:', error);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowUploadModal(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setEditingBanner(null);
    fetchBanners();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bannières</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez les bannières de la page d'accueil
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nouvelle bannière
        </button>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-lg shadow-sm">
        {banners.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">Aucune bannière trouvée</p>
            <p className="text-sm mt-2">Commencez par ajouter votre première bannière</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  {/* Banner Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-40 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Banner Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-600 mt-1">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link && (
                      <p className="text-xs text-blue-600 mt-2">
                        Lien: {banner.link}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Active Toggle */}
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        banner.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.active ? 'Actif' : 'Inactif'}
                    </button>

                    {/* Reorder Buttons */}
                    <button
                      onClick={() => handleMoveUp(banner, index)}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Monter"
                    >
                      <ArrowUpIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(banner, index)}
                      disabled={index === banners.length - 1}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Descendre"
                    >
                      <ArrowDownIcon className="w-5 h-5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-2 text-blue-600 hover:text-blue-900"
                      title="Modifier"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <BannerUpload
          banner={editingBanner}
          onClose={() => {
            setShowUploadModal(false);
            setEditingBanner(null);
          }}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default BannerManager;
