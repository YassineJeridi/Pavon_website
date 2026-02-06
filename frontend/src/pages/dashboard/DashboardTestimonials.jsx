// frontend/src/pages/dashboard/DashboardTestimonials.jsx
import { useState, useEffect } from 'react';
import testimonialService from '../../services/testimonialService';
import { useNotification } from '../../hooks/useNotification';
import {
    PlusIcon, PencilIcon, TrashIcon, StarIcon, XMarkIcon, UserCircleIcon, SparklesIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const DashboardTestimonials = () => {
    const { showSuccess, showError } = useNotification();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        comment: '',
        isFeatured: false,
        avatar: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await testimonialService.getAllTestimonials();
            setTestimonials(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('rating', formData.rating);
            submitData.append('comment', formData.comment);
            submitData.append('isFeatured', formData.isFeatured);

            if (formData.avatar) {
                submitData.append('avatar', formData.avatar);
            }

            if (editing) {
                await testimonialService.updateTestimonial(editing._id, submitData);
                showSuccess('Témoignage mis à jour avec succès!');
            } else {
                await testimonialService.createTestimonial(submitData);
                showSuccess('Témoignage créé avec succès!');
            }
            setShowModal(false);
            setAvatarPreview(null);
            fetchData();
        } catch (error) {
            showError(error, 'Erreur lors de l\'opération');
        }
    };

    const openEdit = (t) => {
        setEditing(t);
        setFormData({
            name: t.name,
            rating: t.rating,
            comment: t.comment,
            isFeatured: t.isFeatured,
            avatar: null
        });
        setAvatarPreview(t.avatar ? `http://localhost:5000${t.avatar}` : null);
        setShowModal(true);
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ name: '', rating: 5, comment: '', isFeatured: false, avatar: null });
        setAvatarPreview(null);
        setShowModal(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;
        try {
            await testimonialService.deleteTestimonial(id);
            showSuccess('Témoignage supprimé avec succès!');
            fetchData();
        } catch (error) {
            showError(error, 'Erreur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d1115]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5d1115] to-[#8d1619] rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ChatBubbleLeftRightIcon className="w-10 h-10" />
                            <h1 className="text-4xl font-bold">Témoignages</h1>
                        </div>
                        <p className="text-[#fdf9ee] opacity-90">
                            Gérez les avis et témoignages de vos clients - {testimonials.length} témoignage{testimonials.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-white text-[#5d1115] hover:bg-[#fdf9ee] px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg transition-all hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5" /> Nouveau témoignage
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#e8ddca]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#111f35] opacity-70 text-sm font-medium">Total témoignages</p>
                            <p className="text-3xl font-bold text-[#111f35] mt-2">{testimonials.length}</p>
                        </div>
                        <ChatBubbleLeftRightIcon className="w-12 h-12 text-[#5d1115] opacity-20" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#5d1115] to-[#8d1619] p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#fdf9ee] opacity-80 text-sm font-medium">En vedette</p>
                            <p className="text-3xl font-bold mt-2">
                                {testimonials.filter(t => t.isFeatured).length}
                            </p>
                        </div>
                        <SparklesIcon className="w-12 h-12 opacity-20" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#e8ddca]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#111f35] opacity-70 text-sm font-medium">Note moyenne</p>
                            <p className="text-3xl font-bold text-[#111f35] mt-2">
                                {testimonials.length > 0
                                    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                                    : '0'}
                                <span className="text-lg text-gray-500">/5</span>
                            </p>
                        </div>
                        <StarIconSolid className="w-12 h-12 text-yellow-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Testimonials Grid */}
            {testimonials.length === 0 ? (
                <div className="bg-white p-16 rounded-xl text-center border-2 border-[#e8ddca]">
                    <ChatBubbleLeftRightIcon className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl text-gray-500 mb-4">Aucun témoignage pour le moment</p>
                    <button
                        onClick={openCreate}
                        className="bg-[#5d1115] text-[#fdf9ee] px-6 py-3 rounded-lg hover:bg-[#7d1419] transition-colors"
                    >
                        Créer le premier témoignage
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t._id}
                            className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl hover:scale-[1.02] ${t.isFeatured ? 'border-[#5d1115]' : 'border-[#e8ddca]'
                                }`}
                        >
                            {/* Featured Badge */}
                            {t.isFeatured && (
                                <div className="bg-gradient-to-r from-[#5d1115] to-[#8d1619] px-4 py-2 flex items-center justify-center gap-2 text-white text-sm font-semibold">
                                    <SparklesIcon className="w-4 h-4" />
                                    Témoignage vedette
                                </div>
                            )}

                            <div className="p-6">
                                {/* Avatar Section */}
                                <div className="flex justify-center mb-4">
                                    {t.avatar ? (
                                        <img
                                            src={`http://localhost:5000${t.avatar}`}
                                            alt={t.name}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-[#e8ddca] shadow-md"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(t.name) + '&background=5d1115&color=fdf9ee&bold=true&size=80';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5d1115] to-[#8d1619] flex items-center justify-center text-white text-2xl font-bold border-4 border-[#e8ddca] shadow-md">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Name */}
                                <h3 className="text-center text-xl font-bold text-[#111f35] mb-2">{t.name}</h3>

                                {/* Rating Stars */}
                                <div className="flex justify-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        i < t.rating
                                            ? <StarIconSolid key={i} className="w-5 h-5 text-yellow-500" />
                                            : <StarIcon key={i} className="w-5 h-5 text-gray-300" />
                                    ))}
                                </div>

                                {/* Comment */}
                                <div className="bg-[#fdf9ee] p-4 rounded-lg mb-4 min-h-[100px]">
                                    <p className="text-[#111f35] text-sm leading-relaxed italic">
                                        "{t.comment}"
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(t)}
                                        className="flex-1 bg-[#111f35] text-white py-2 px-4 rounded-lg hover:bg-[#1a2d4a] transition-colors flex items-center justify-center gap-2 font-medium"
                                    >
                                        <PencilIcon className="w-4 h-4" /> Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t._id)}
                                        className="bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors border-2 border-red-200"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-[#5d1115] to-[#8d1619] p-6 text-white rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserCircleIcon className="w-8 h-8" />
                                    <h2 className="text-2xl font-bold">
                                        {editing ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Avatar Upload */}
                            <div>
                                <label className="block text-sm font-bold text-[#111f35] mb-3">Photo du client</label>
                                <div className="flex items-center gap-6">
                                    <div className="flex-shrink-0">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Preview"
                                                className="w-24 h-24 rounded-full object-cover border-4 border-[#e8ddca] shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5d1115] to-[#8d1619] flex items-center justify-center border-4 border-[#e8ddca] shadow-lg">
                                                <UserCircleIcon className="w-12 h-12 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="w-full border-2 border-[#e8ddca] p-3 rounded-lg text-sm focus:outline-none focus:border-[#5d1115] bg-[#fdf9ee]"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Format recommandé: JPG, PNG (max 2MB)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-bold text-[#111f35] mb-2">Nom du client *</label>
                                <input
                                    className="w-full border-2 border-[#e8ddca] p-3 rounded-lg focus:outline-none focus:border-[#5d1115] bg-[#fdf9ee]"
                                    placeholder="Ex: Marie Dupont"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-bold text-[#111f35] mb-2">Note *</label>
                                <div className="flex gap-2">
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating })}
                                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${formData.rating === rating
                                                ? 'bg-[#5d1115] text-white border-[#5d1115]'
                                                : 'bg-white text-[#111f35] border-[#e8ddca] hover:border-[#5d1115]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-lg font-bold">{rating}</span>
                                                <StarIconSolid className="w-5 h-5 text-yellow-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-bold text-[#111f35] mb-2">Témoignage *</label>
                                <textarea
                                    className="w-full border-2 border-[#e8ddca] p-4 rounded-lg focus:outline-none focus:border-[#5d1115] bg-[#fdf9ee] min-h-[150px]"
                                    placeholder="Partagez l'avis du client sur vos produits ou services..."
                                    rows="5"
                                    value={formData.comment}
                                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.comment.length} caractères</p>
                            </div>

                            {/* Featured Toggle */}
                            <div className="bg-[#fdf9ee] p-4 rounded-lg border-2 border-[#e8ddca]">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="w-5 h-5 text-[#5d1115] border-gray-300 rounded focus:ring-[#5d1115]"
                                    />
                                    <div className="flex items-center gap-2">
                                        <SparklesIcon className="w-5 h-5 text-[#5d1115]" />
                                        <span className="font-semibold text-[#111f35]">Mettre en vedette</span>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-600 mt-2 ml-8">
                                    Les témoignages en vedette seront affichés en priorité sur votre site
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#5d1115] to-[#8d1619] text-white py-4 rounded-lg font-bold text-lg hover:from-[#7d1419] hover:to-[#ad181d] transition-all shadow-lg hover:shadow-xl"
                            >
                                {editing ? 'Mettre à jour' : 'Créer le témoignage'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardTestimonials;
