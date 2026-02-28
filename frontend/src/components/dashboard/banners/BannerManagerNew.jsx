// frontend/src/components/dashboard/banners/BannerManagerNew.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Image as ImageIcon, MoveUp, MoveDown, Sparkles } from 'lucide-react';
import bannerService from '../../../services/bannerService';
import { useNotification } from '../../../hooks/useNotification';
import { getBannerImageUrl } from '../../../utils/imageUtils';


const BannerManagerNew = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { showSuccess, showError, showLoading, removeNotification } = useNotification();

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        link: '',
        buttonText: 'Découvrir',
        isActive: true,
        order: 0,
        image: null
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await bannerService.getAllBanners();
            const bannersData = response?.data || response || [];
            setBanners(bannersData);
        } catch (error) {
            console.error('Error fetching banners:', error);
            showError(error, 'chargement des bannières');
            setBanners([]);
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
            editingBanner ? 'Mise à jour de la bannière...' : 'Création de la bannière...',
            editingBanner ? 'Mise à jour' : 'Création'
        );

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('description', formData.description);
            data.append('link', formData.link);
            data.append('buttonText', formData.buttonText);
            data.append('position', 'hero');
            data.append('isActive', formData.isActive);
            data.append('order', formData.order);

            if (formData.image instanceof File) {
                data.append('image', formData.image);
            }

            if (editingBanner) {
                await bannerService.updateBanner(editingBanner._id, data);
                showSuccess('Bannière mise à jour avec succès');
            } else {
                await bannerService.createBanner(data);
                showSuccess('Bannière créée avec succès');
            }

            removeNotification(loadingId);
            closeModal();
            fetchBanners();
        } catch (error) {
            removeNotification(loadingId);
            console.error('Error saving banner:', error);
            showError(error, editingBanner ? 'mise à jour de la bannière' : 'création de la bannière');
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            link: banner.link || '',
            buttonText: banner.buttonText || 'Découvrir',

            isActive: banner.isActive !== false,
            order: banner.order || 0,
            image: null
        });
        setImagePreview(getBannerImageUrl(banner));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) return;

        const loadingId = showLoading('Suppression en cours...');

        try {
            await bannerService.deleteBanner(id);
            removeNotification(loadingId);
            showSuccess('Bannière supprimée avec succès');
            fetchBanners();
        } catch (error) {
            removeNotification(loadingId);
            console.error('Error deleting banner:', error);
            showError(error, 'suppression de la bannière');
        }
    };

    const toggleActive = async (banner) => {
        try {
            const updateData = { isActive: !banner.isActive };
            await bannerService.updateBanner(banner._id, updateData);
            showSuccess(
                banner.isActive
                    ? 'Bannière désactivée avec succès'
                    : 'Bannière activée avec succès'
            );
            fetchBanners();
        } catch (error) {
            console.error('Error toggling banner:', error);
            showError(error, 'activation/désactivation de la bannière');
        }
    };

    const moveOrder = async (banner, direction) => {
        const currentIndex = banners.findIndex(b => b._id === banner._id);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === banners.length - 1)
        ) {
            return;
        }

        const newBanners = [...banners];
        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        [newBanners[currentIndex], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[currentIndex]];

        try {
            // Update only the order field for each banner
            for (let i = 0; i < newBanners.length; i++) {
                await bannerService.updateBanner(newBanners[i]._id, { order: i });
            }
            setBanners(newBanners);
            showSuccess('Ordre des bannières mis à jour');
        } catch (error) {
            console.error('Error reordering:', error);
            showError(error, 'réordonnement des bannières');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            link: '',
            buttonText: 'Découvrir',
            isActive: true,
            order: 0,
            image: null
        });
        setImagePreview(null);
    };

    const positionLabels = {
        hero: 'Hero (Principal)',
        promotional: 'Promotionnel',
        category: 'Catégorie',
        footer: 'Pied de page'
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
                        Gestion des Bannières
                    </h1>
                    <p className="text-gray-600 mt-2">Créez et gérez les bannières promotionnelles de votre site</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#5d1115] text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:bg-[#111f35] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Nouvelle Bannière</span>
                </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold">{banners.length}</div>
                    <div className="text-purple-100 mt-1">Total Bannières</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold">{banners.filter(b => b.isActive).length}</div>
                    <div className="text-green-100 mt-1">Actives</div>
                </div>
                <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold">{banners.filter(b => !b.isActive).length}</div>
                    <div className="text-gray-100 mt-1">Inactives</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold">{banners.filter(b => b.position === 'hero').length}</div>
                    <div className="text-blue-100 mt-1">Hero Banners</div>
                </div>
            </div>

            {/* Banners Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {banners.map((banner, index) => (
                        <motion.div
                            key={banner._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Banner Image */}
                            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden group">
                                {banner.image ? (
                                    <img
                                        src={getBannerImageUrl(banner)}
                                        alt={banner.title}
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
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${banner.isActive
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-500 text-white'
                                        }`}>
                                        {banner.isActive ? '● Active' : '○ Inactive'}
                                    </span>
                                </div>

                                {/* Position Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-purple-700 shadow-lg">
                                        {positionLabels[banner.position] || banner.position}
                                    </span>
                                </div>
                            </div>

                            {/* Banner Content */}
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{banner.title}</h3>

                                {banner.subtitle && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{banner.subtitle}</p>
                                )}

                                {banner.link && (
                                    <div className="text-xs text-blue-600 mb-4 flex items-center gap-1 truncate">
                                        <span>→</span>
                                        <span className="truncate">{banner.link}</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleActive(banner)}
                                        className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${banner.isActive
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        title={banner.isActive ? 'Désactiver' : 'Activer'}
                                    >
                                        {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        <span className="hidden sm:inline">{banner.isActive ? 'Masquer' : 'Afficher'}</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => moveOrder(banner, 'up')}
                                        disabled={index === 0}
                                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Monter"
                                    >
                                        <MoveUp className="w-4 h-4" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => moveOrder(banner, 'down')}
                                        disabled={index === banners.length - 1}
                                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Descendre"
                                    >
                                        <MoveDown className="w-4 h-4" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(banner)}
                                        className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                                        title="Modifier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(banner._id)}
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
            {banners.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200"
                >
                    <ImageIcon className="w-20 h-20 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucune bannière</h3>
                    <p className="text-gray-500 mb-6">Créez votre première bannière promotionnelle</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#5d1115] text-white px-8 py-3 rounded-xl inline-flex items-center gap-2 shadow-lg hover:bg-[#111f35] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Créer une bannière</span>
                    </motion.button>
                </motion.div>
            )}

            {/* Modal */}
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
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-[#5d1115] text-white px-6 py-5 flex justify-between items-center rounded-t-2xl">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Sparkles className="w-6 h-6" />
                                    {editingBanner ? 'Modifier la Bannière' : 'Nouvelle Bannière'}
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
                                        Image de la bannière <span className="text-red-500">*</span>
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
                                                required={!editingBanner}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Titre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Ex: Nouvelle Collection Été 2026"
                                    />
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sous-titre
                                    </label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Ex: Jusqu'à -50% sur une sélection"
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
                                        placeholder="Description détaillée de la bannière..."
                                    />
                                </div>

                                {/* Link & Button Text */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Lien (URL)
                                        </label>
                                        <input
                                            type="text"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="/collections/nouveautes"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Texte du bouton
                                        </label>
                                        <input
                                            type="text"
                                            name="buttonText"
                                            value={formData.buttonText}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Découvrir"
                                        />
                                    </div>
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
                                        Bannière active (visible sur le site)
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                                    >
                                        Annuler
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-6 py-3 bg-[#5d1115] text-white rounded-xl hover:bg-[#111f35] hover:shadow-lg font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{editingBanner ? 'Mettre à jour' : 'Créer la bannière'}</span>
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

export default BannerManagerNew;
