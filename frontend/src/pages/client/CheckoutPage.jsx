// frontend/src/pages/client/CheckoutPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';
import { tunisiaStates } from '../../utils/tunisiaStates';
import { getDelegationsByGovernorate } from '../../utils/tunisiaDelegations';
import orderService from '../../services/orderService';
import {
    ShoppingBagIcon,
    TruckIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    UserIcon,
    HomeIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

const DELIVERY_COST = 7; // 7 TND

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, cartSubtotal, clearCart } = useCart();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        delegation: '',
        postalCode: '',
        deliveryDate: '',
        paymentMethod: '',
    });

    const [availableDelegations, setAvailableDelegations] = useState([]);

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Redirect if cart is empty
        if (!cart?.items || cart.items.length === 0) {
            navigate('/produits');
            showNotification('Votre panier est vide', 'error');
        }
    }, [cart, navigate, showNotification]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Le téléphone est requis';
        } else if (!/^[0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Numéro de téléphone invalide (8 chiffres)';
        }

        // Email is now optional
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'L\'adresse est requise';
        }

        if (!formData.city) {
            newErrors.city = 'Le gouvernorat est requis';
        }

        if (!formData.delegation) {
            newErrors.delegation = 'La délégation est requise';
        }

        // Postal code is optional, but if filled must be valid
        if (formData.postalCode.trim() && !/^[0-9]{4}$/.test(formData.postalCode)) {
            newErrors.postalCode = 'Code postal invalide (4 chiffres)';
        }

        if (!formData.deliveryDate) {
            newErrors.deliveryDate = 'La date de livraison est requise';
        }

        if (!formData.paymentMethod) {
            newErrors.paymentMethod = 'Le mode de paiement est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Update available delegations when governorate changes
        if (name === 'city') {
            const delegations = getDelegationsByGovernorate(value);
            setAvailableDelegations(delegations);
            setFormData(prev => ({ ...prev, delegation: '' })); // Reset delegation
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Veuillez corriger les erreurs', 'error');
            return;
        }

        setSubmitting(true);

        try {
            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: formData.email,
                },
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    delegation: formData.delegation,
                    postalCode: formData.postalCode,
                    country: 'Tunisie',
                },
                deliveryDate: formData.deliveryDate,
                paymentMethod: formData.paymentMethod,
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    size: item.size || 'Standard',
                    color: item.color || 'Standard',
                })),
                paymentMethod: 'cash_on_delivery',
                notes: '',
            };

            console.log('Sending order data:', JSON.stringify(orderData, null, 2));
            await orderService.createOrder(orderData);

            clearCart();
            showNotification('Commande passée avec succès!', 'success');
            navigate('/');
        } catch (error) {
            console.error('Error creating order:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la commande';
            const validationErrors = error.response?.data?.errors || [];
            console.error('Validation errors:', validationErrors);

            // Show all validation errors
            if (validationErrors.length > 0) {
                validationErrors.forEach((err, index) => {
                    console.error(`Validation error ${index + 1}:`, err);
                });
            }

            showNotification(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const totalAmount = cartSubtotal + DELIVERY_COST;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Finaliser votre commande</h1>
                    <p className="text-gray-600">Remplissez vos informations de livraison</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#fdf9ee] rounded-lg">
                                        <UserIcon className="w-6 h-6 text-[#5d1115]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Prénom <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all`}
                                            placeholder="Votre prénom"
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Nom <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all`}
                                            placeholder="Votre nom"
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Téléphone <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all`}
                                                placeholder="20 123 456"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Email <span className="text-gray-400">(Optionnel)</span>
                                        </label>
                                        <div className="relative">
                                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all`}
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#fdf9ee] rounded-lg">
                                        <MapPinIcon className="w-6 h-6 text-[#5d1115]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Adresse de livraison</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Adresse complète <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <HomeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className={`w-full pl-10 pr-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all resize-none`}
                                                placeholder="Rue, numéro, bâtiment..."
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Gouvernorat <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-10 pr-4 py-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all appearance-none bg-white`}
                                                >
                                                    <option value="">Sélectionner...</option>
                                                    {tunisiaStates.map((state) => (
                                                        <option key={state.code} value={state.name}>
                                                            {state.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.city && (
                                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                            )}
                                        </div>

                                        {/* Delegation */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Délégation <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    name="delegation"
                                                    value={formData.delegation}
                                                    onChange={handleInputChange}
                                                    disabled={!formData.city}
                                                    className={`w-full pl-10 pr-4 py-3 border ${errors.delegation ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                                >
                                                    <option value="">Sélectionner...</option>
                                                    {availableDelegations.map((delegation) => (
                                                        <option key={delegation} value={delegation}>
                                                            {delegation}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.delegation && (
                                                <p className="text-red-500 text-sm mt-1">{errors.delegation}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* Postal Code */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Code postal <span className="text-gray-400">(Optionnel)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                maxLength={4}
                                                className={`w-full px-4 py-3 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all`}
                                                placeholder="1000"
                                            />
                                            {errors.postalCode && (
                                                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Date & Payment Method */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#fdf9ee] rounded-lg">
                                        <CalendarIcon className="w-6 h-6 text-[#5d1115]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Détails de livraison et paiement</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Delivery Date */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Date de livraison souhaitée <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                name="deliveryDate"
                                                value={formData.deliveryDate}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className={`w-full pl-10 pr-4 py-3 border ${errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all`}
                                            />
                                        </div>
                                        {errors.deliveryDate && (
                                            <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Mode de paiement <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-3">
                                            {/* Check */}
                                            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                formData.paymentMethod === 'check'
                                                    ? 'border-[#5d1115] bg-[#fdf9ee]'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="check"
                                                    checked={formData.paymentMethod === 'check'}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-[#5d1115] focus:ring-[#5d1115]"
                                                />
                                                <div className="ml-3 flex items-center">
                                                    <CreditCardIcon className="w-5 h-5 text-[#5d1115] mr-2" />
                                                    <span className="font-medium text-gray-900">Chèque</span>
                                                </div>
                                            </label>

                                            {/* TPE */}
                                            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                formData.paymentMethod === 'tpe'
                                                    ? 'border-[#5d1115] bg-[#fdf9ee]'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="tpe"
                                                    checked={formData.paymentMethod === 'tpe'}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-[#5d1115] focus:ring-[#5d1115]"
                                                />
                                                <div className="ml-3 flex items-center">
                                                    <CreditCardIcon className="w-5 h-5 text-[#5d1115] mr-2" />
                                                    <span className="font-medium text-gray-900">TPE (Terminal de Paiement Électronique)</span>
                                                </div>
                                            </label>

                                            {/* Cash */}
                                            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                formData.paymentMethod === 'cash'
                                                    ? 'border-[#5d1115] bg-[#fdf9ee]'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cash"
                                                    checked={formData.paymentMethod === 'cash'}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-[#5d1115] focus:ring-[#5d1115]"
                                                />
                                                <div className="ml-3 flex items-center">
                                                    <CreditCardIcon className="w-5 h-5 text-[#5d1115] mr-2" />
                                                    <span className="font-medium text-gray-900">Espèce (Cash)</span>
                                                </div>
                                            </label>
                                        </div>
                                        {errors.paymentMethod && (
                                            <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button (Mobile) */}
                            <div className="lg:hidden">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Traitement...' : `Commander (${totalAmount.toFixed(2)} TND)`}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#fdf9ee] rounded-lg">
                                    <ShoppingBagIcon className="w-6 h-6 text-[#5d1115]" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Résumé de commande</h2>
                            </div>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {cart?.items?.map((item, index) => (
                                    <div key={index} className="flex gap-3 pb-4 border-b border-gray-100">
                                        <img
                                            src={item.product.images?.[0]?.startsWith('http')
                                                ? item.product.images[0]
                                                : `http://localhost:5000${item.product.images?.[0]}`
                                            }
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 text-sm">{item.product.name}</h4>
                                            <p className="text-xs text-gray-600">
                                                {item.size && `Taille: ${item.size}`} {item.color && `• ${item.color}`}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.quantity} × {item.product.price} TND
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Sous-total</span>
                                    <span className="font-semibold">{cartSubtotal.toFixed(2)} TND</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <TruckIcon className="w-5 h-5 text-[#5d1115]" />
                                        <span>Livraison</span>
                                    </div>
                                    <span className="font-semibold">{DELIVERY_COST.toFixed(2)} TND</span>
                                </div>
                                <div className="pt-3 border-t-2 border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
                                            {totalAmount.toFixed(2)} TND
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button (Desktop) */}
                            <div className="hidden lg:block">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Traitement...' : 'Commander'}
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                En passant commande, vous acceptez nos conditions générales
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
