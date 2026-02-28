// frontend/src/pages/dashboard/DashboardTopBanner.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Megaphone } from 'lucide-react';
import topBannerService from '../../services/topBannerService';
import { useNotification } from '../../hooks/useNotification';

const DashboardTopBanner = () => {
  const { showSuccess, showError, showLoading } = useNotification();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [formData, setFormData] = useState({
    text: '',
    isActive: true,
    link: '',
  });

  useEffect(() => {
    document.title = 'Bannière Supérieure - Pavone Admin';
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await topBannerService.getAll();
      setBanners(response?.data || []);
    } catch (error) {
      console.error('Error fetching top banners:', error);
      showError(error, 'chargement des bannières');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        text: banner.text,
        isActive: banner.isActive,
        link: banner.link || '',
      });
    } else {
      setEditingBanner(null);
      setFormData({
        text: '',
        isActive: true,
        link: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData({
      text: '',
      isActive: true,
      link: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingId = showLoading(
      editingBanner ? 'Mise à jour de la bannière...' : 'Création de la bannière...',
      editingBanner ? 'Mise à jour' : 'Création'
    );

    try {
      const bannerData = {
        text: formData.text,
        isActive: formData.isActive,
        link: formData.link || undefined,
      };

      if (editingBanner) {
        await topBannerService.update(editingBanner._id, bannerData);
        showSuccess('Bannière mise à jour avec succès');
      } else {
        await topBannerService.create(bannerData);
        showSuccess('Bannière créée avec succès');
      }

      fetchBanners();
      closeModal();
    } catch (error) {
      console.error('Error saving banner:', error);
      showError(error, editingBanner ? 'mise à jour' : 'création');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      return;
    }

    try {
      await topBannerService.delete(id);
      setBanners(banners.filter(b => b._id !== id));
      showSuccess('Bannière supprimée avec succès');
    } catch (error) {
      console.error('Error deleting banner:', error);
      showError(error, 'suppression');
    }
  };

  const toggleActive = async (id) => {
    try {
      await topBannerService.toggleActive(id);
      fetchBanners();
      showSuccess('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error toggling banner:', error);
      showError(error, 'changement de statut');
    }
  };

  const activeBanners = banners.filter(b => b.isActive);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Bannière Supérieure
          </h1>
          <p className="text-gray-600">Gérez le message affiché en haut du site</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Bannière
        </motion.button>
      </motion.div>

      {/* Active Banners Preview */}
      {activeBanners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            Aperçu des bannières actives ({activeBanners.length})
          </h2>
          <div className="bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white py-3 px-6 rounded-xl overflow-hidden whitespace-nowrap">
            <p className="text-center text-sm md:text-base font-medium">
              {activeBanners.map(b => b.text).join('   ★   ')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Banners List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Toutes les bannières</h2>
        
        {banners.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Aucune bannière</p>
            <p className="text-gray-400 text-sm mt-2">Créez votre première bannière pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => (
              <motion.div
                key={banner._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -2 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          banner.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">{banner.text}</p>
                    {banner.link && (
                      <p className="text-sm text-gray-500">
                        Lien: <span className="text-blue-600">{banner.link}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Créée le {new Date(banner.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleActive(banner._id)}
                      className={`p-2 rounded-lg transition-all ${
                        banner.isActive
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={banner.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {banner.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(banner)}
                      className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {editingBanner ? 'Modifier la Bannière' : 'Nouvelle Bannière'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Texte de la Bannière <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                    required
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Ex: Livraison gratuite dès 200 TND | Retours gratuits sous 30 jours"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.text.length}/200 caractères
                  </p>
                </div>

                {/* Link (Optional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lien (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Ex: /produits ou https://example.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    La bannière redirigera vers ce lien au clic
                  </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Activer cette bannière
                    {!editingBanner && <span className="text-gray-500 ml-2">(plusieurs bannières peuvent être actives)</span>}
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5" />
                    {editingBanner ? 'Mettre à jour' : 'Créer'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardTopBanner;
