// frontend/src/pages/dashboard/DashboardCategories.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Image as ImageIcon, MoveUp, MoveDown, Tag, Search } from 'lucide-react';
import categoryService from '../../services/categoryService';
import { useNotification } from '../../hooks/useNotification';
import { getCategoryImageUrl } from '../../utils/imageUtils';

const DashboardCategories = () => {
  const { showSuccess, showError, showLoading } = useNotification();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    order: 0,
    image: null
  });

  useEffect(() => {
    document.title = 'Catégories - Pavon Admin';
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();

      // Handle multiple response formats
      let categoriesArray = [];
      if (Array.isArray(response)) {
        categoriesArray = response;
      } else if (response.categories && Array.isArray(response.categories)) {
        categoriesArray = response.categories;
      } else if (response.data && Array.isArray(response.data)) {
        categoriesArray = response.data;
      }

      // Sort by order field
      categoriesArray.sort((a, b) => (a.order || 0) - (b.order || 0));

      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError(error, 'chargement des catégories');
      setCategories([]);
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
      editingCategory ? 'Mise à jour de la catégorie...' : 'Création de la catégorie...',
      editingCategory ? 'Mise à jour' : 'Création'
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
      data.append('order', formData.order);

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      let response;
      if (editingCategory) {
        response = await categoryService.updateCategory(editingCategory._id, data);
        showSuccess('Catégorie mise à jour avec succès');
      } else {
        response = await categoryService.createCategory(data);
        showSuccess('Catégorie créée avec succès');
      }

      console.log('Category save response:', response);
      fetchCategories();
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
      showError(error, editingCategory ? 'mise à jour' : 'création');
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive ?? true,
        order: category.order || 0,
        image: null
      });
      setImagePreview(getCategoryImageUrl(category.image));
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        isActive: true,
        order: 0,
        image: null
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
      order: 0,
      image: null
    });
    setImagePreview(null);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(categories.filter(c => c._id !== categoryId));
      showSuccess('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Error deleting category:', error);
      showError(error, 'suppression');
    }
  };

  const toggleActive = async (category) => {
    try {
      const data = new FormData();
      data.append('name', category.name);
      data.append('slug', category.slug);
      data.append('description', category.description || '');
      data.append('isActive', !category.isActive);
      data.append('order', category.order || 0);

      await categoryService.updateCategory(category._id, data);
      setCategories(categories.map(c =>
        c._id === category._id ? { ...c, isActive: !c.isActive } : c
      ));
      showSuccess(`Catégorie ${!category.isActive ? 'activée' : 'désactivée'} avec succès`);
    } catch (error) {
      console.error('Error toggling category:', error);
      showError(error, 'changement de statut');
    }
  };

  const moveCategory = async (category, direction) => {
    const currentIndex = categories.findIndex(c => c._id === category._id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === categories.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newCategories = [...categories];
    [newCategories[currentIndex], newCategories[newIndex]] = [newCategories[newIndex], newCategories[currentIndex]];

    // Update orders
    const updates = newCategories.map((cat, idx) => ({
      ...cat,
      order: idx
    }));

    setCategories(updates);

    try {
      // Update both affected categories
      const data1 = new FormData();
      data1.append('name', updates[currentIndex].name);
      data1.append('slug', updates[currentIndex].slug);
      data1.append('description', updates[currentIndex].description || '');
      data1.append('isActive', updates[currentIndex].isActive);
      data1.append('order', currentIndex);

      const data2 = new FormData();
      data2.append('name', updates[newIndex].name);
      data2.append('slug', updates[newIndex].slug);
      data2.append('description', updates[newIndex].description || '');
      data2.append('isActive', updates[newIndex].isActive);
      data2.append('order', newIndex);

      await Promise.all([
        categoryService.updateCategory(updates[currentIndex]._id, data1),
        categoryService.updateCategory(updates[newIndex]._id, data2)
      ]);
    } catch (error) {
      console.error('Error reordering categories:', error);
      fetchCategories(); // Revert on error
    }
  };

  // Calculate stats
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des catégories...</p>
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
            Catégories
          </h1>
          <p className="text-gray-600">Organisez vos produits par catégorie</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Catégorie
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total</p>
              <p className="text-4xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Tag className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Actives</p>
              <p className="text-4xl font-bold">{stats.active}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Eye className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium mb-1">Inactives</p>
              <p className="text-4xl font-bold">{stats.inactive}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <EyeOff className="w-8 h-8" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
        />
      </motion.div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-lg"
        >
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {searchQuery ? 'Aucune catégorie trouvée' : 'Aucune catégorie'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery ? 'Essayez une autre recherche' : 'Créez votre première catégorie pour commencer'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {category.image ? (
                    <img
                      src={getCategoryImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                        category.isActive
                          ? 'bg-green-500/90 text-white'
                          : 'bg-gray-500/90 text-white'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Order Buttons */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <button
                      onClick={() => moveCategory(category, 'up')}
                      disabled={index === 0}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <MoveUp className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => moveCategory(category, 'down')}
                      disabled={index === filteredCategories.length - 1}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <MoveDown className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleActive(category)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                        category.isActive
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {category.isActive ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Activer
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(category)}
                      className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(category._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

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
                    {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
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
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Image de la Catégorie
                  </label>
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay with buttons */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors">
                            <Edit className="w-5 h-5" />
                            Modifier
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                            Supprimer
                          </button>
                        </div>

                        {/* Mobile buttons (always visible on small screens) */}
                        <div className="absolute top-2 right-2 flex gap-2 md:hidden">
                          <label className="p-2 bg-white text-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                            <Edit className="w-5 h-5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600 font-medium">
                          Cliquez pour ajouter une image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Ex: Robes"
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
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Description de la catégorie..."
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Catégorie active
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
                    {editingCategory ? 'Mettre à jour' : 'Créer'}
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

export default DashboardCategories;
