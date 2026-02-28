import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Image as ImageIcon, MoveUp, MoveDown, Sparkles, Star } from 'lucide-react';
import { collectionService } from '../../services/collectionService';
import { useNotification } from '../../hooks/useNotification';
import { getCollectionImageUrl } from '../../utils/imageUtils';

const DashboardCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { showSuccess, showError, showLoading, removeNotification } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    isFeatured: false,
    order: 0,
    image: null
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await collectionService.getAdminCollections();
      const collectionsData = response?.data?.data || response?.data || response || [];
      setCollections(collectionsData);
    } catch (error) {
      console.error('Error fetching collections:', error);
      showError(error, 'chargement des collections');
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingId = showLoading(
      editingCollection ? 'Mise à jour de la collection...' : 'Création de la collection...',
      editingCollection ? 'Mise à jour' : 'Création'
    );

    try {
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Remove consecutive hyphens

      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', slug);
      data.append('description', formData.description);
      data.append('isActive', formData.isActive);
      data.append('isFeatured', formData.isFeatured);
      data.append('order', formData.order);

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      if (editingCollection) {
        await collectionService.updateCollection(editingCollection._id, data);
        showSuccess('Collection mise à jour avec succès');
      } else {
        await collectionService.createCollection(data);
        showSuccess('Collection créée avec succès');
      }

      removeNotification(loadingId);
      closeModal();
      fetchCollections();
    } catch (error) {
      console.error('Error saving collection:', error);
      removeNotification(loadingId);
      showError(error, editingCollection ? 'mise à jour' : 'création');
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name || '',
      description: collection.description || '',
      isActive: collection.isActive !== undefined ? collection.isActive : true,
      isFeatured: collection.isFeatured || false,
      order: collection.order || 0,
      image: null
    });
    
    if (collection.image) {
      setImagePreview(getCollectionImageUrl(collection));
    }
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) return;

    const loadingId = showLoading('Suppression de la collection...', 'Suppression');

    try {
      await collectionService.deleteCollection(id);
      removeNotification(loadingId);
      showSuccess('Collection supprimée avec succès');
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      removeNotification(loadingId);
      showError(error, 'suppression');
    }
  };

  const toggleActive = async (collection) => {
    const loadingId = showLoading(
      collection.isActive ? 'Désactivation...' : 'Activation...',
      'Statut'
    );

    try {
      await collectionService.toggleActive(collection._id);
      removeNotification(loadingId);
      showSuccess(`Collection ${collection.isActive ? 'désactivée' : 'activée'} avec succès`);
      fetchCollections();
    } catch (error) {
      console.error('Error toggling active status:', error);
      removeNotification(loadingId);
      showError(error, 'modification du statut');
    }
  };

  const toggleFeatured = async (collection) => {
    const loadingId = showLoading(
      collection.featured ? 'Retrait des vedettes...' : 'Ajout aux vedettes...',
      'Vedette'
    );

    try {
      await collectionService.toggleFeatured(collection._id);
      removeNotification(loadingId);
      showSuccess(`Collection ${collection.featured ? 'retirée des' : 'ajoutée aux'} vedettes`);
      fetchCollections();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      removeNotification(loadingId);
      showError(error, 'modification du statut vedette');
    }
  };

  const moveOrder = async (collection, direction) => {
    const currentIndex = collections.findIndex(c => c._id === collection._id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === collections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetCollection = collections[targetIndex];

    const loadingId = showLoading('Réorganisation...', 'Ordre');

    try {
      await Promise.all([
        collectionService.updateCollection(collection._id, { order: targetCollection.order }),
        collectionService.updateCollection(targetCollection._id, { order: collection.order })
      ]);

      removeNotification(loadingId);
      showSuccess('Ordre mis à jour');
      fetchCollections();
    } catch (error) {
      console.error('Error moving collection:', error);
      removeNotification(loadingId);
      showError(error, 'réorganisation');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
      isFeatured: false,
      order: 0,
      image: null
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d1115]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#5d1115]" />
            Gestion des Collections
          </h1>
          <p className="text-gray-600 mt-2">Créez et gérez les collections de produits de votre boutique</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#5d1115] text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:bg-[#111f35] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Nouvelle Collection</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold">{collections.length}</div>
          <div className="text-purple-100 mt-1">Total Collections</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold">{collections.filter(c => c.isActive).length}</div>
          <div className="text-green-100 mt-1">Actives</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold">{collections.filter(c => c.isFeatured).length}</div>
          <div className="text-yellow-100 mt-1">En Vedette</div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold">{collections.filter(c => !c.isActive).length}</div>
          <div className="text-gray-100 mt-1">Inactives</div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {collections.map((collection, index) => (
            <motion.div
              key={collection._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              {/* Collection Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden group">
                {collection.image ? (
                  <img
                    src={getCollectionImageUrl(collection)}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-purple-300" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${collection.isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                    }`}>
                    {collection.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </div>

                {/* Featured Badge */}
                {collection.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Vedette
                    </span>
                  </div>
                )}
              </div>

              {/* Collection Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{collection.name}</h3>

                {collection.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{collection.description}</p>
                )}

                {collection.slug && (
                  <div className="text-xs text-blue-600 mb-4 flex items-center gap-1 truncate">
                    <span>→</span>
                    <span className="truncate">/collections/{collection.slug}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleActive(collection)}
                    className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${collection.isActive
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    title={collection.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {collection.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="hidden sm:inline">{collection.isActive ? 'Masquer' : 'Afficher'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFeatured(collection)}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-all ${collection.isFeatured
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    title={collection.isFeatured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                  >
                    <Star className={`w-4 h-4 ${collection.isFeatured ? 'fill-current' : ''}`} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => moveOrder(collection, 'up')}
                    disabled={index === 0}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Monter"
                  >
                    <MoveUp className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => moveOrder(collection, 'down')}
                    disabled={index === collections.length - 1}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Descendre"
                  >
                    <MoveDown className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(collection)}
                    className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(collection._id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {collections.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200"
        >
          <ImageIcon className="w-20 h-20 text-purple-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucune collection</h3>
          <p className="text-gray-500 mb-6">Créez votre première collection de produits</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#5d1115] text-white px-8 py-3 rounded-xl inline-flex items-center gap-2 shadow-lg hover:bg-[#111f35] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Créer une collection</span>
          </motion.button>
        </motion.div>
      )}

      {/* Modal for Create/Edit Collection */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#5d1115] text-white px-6 py-5 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  {editingCollection ? 'Modifier la Collection' : 'Nouvelle Collection'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Image de la collection <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative rounded-xl overflow-hidden border-2 border-purple-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <label className="cursor-pointer block">
                      <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 hover:border-purple-500 hover:bg-purple-50 transition-all text-center">
                        <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <span className="text-sm font-medium text-gray-700">
                          {imagePreview ? 'Changer l\'image' : 'Ajouter une image'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (max 10MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!editingCollection}
                      />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la collection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Ex: Collection Été 2026"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Description détaillée de la collection..."
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  {/* Active Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#5d1115] border-gray-300 rounded focus:ring-[#5d1115]"
                    />
                    <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Collection active (visible sur le site)
                    </label>
                  </div>

                  {/* Featured Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Mettre en vedette (affichée sur la page d'accueil)
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-[#5d1115] text-white rounded-xl font-semibold hover:bg-[#111f35] transition-all shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" />
                      {editingCollection ? 'Mettre à jour' : 'Créer'}
                    </span>
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

export default DashboardCollections;
