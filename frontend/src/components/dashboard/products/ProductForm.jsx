// frontend/src/components/dashboard/products/ProductForm.jsx

import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import  productService  from '../../../services/productService';
import  categoryService  from '../../../services/categoryService';
import { collectionService } from '../../../services/collectionService';


const ProductForm = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category?._id || '',
    collection: product?.collection?._id || '',
    colors: product?.colors || [],
    sizes: {
      type: product?.sizes?.type || 'letter',
      available: product?.sizes?.available || [],
    },
    stock: product?.stock || '',
    isFeatured: product?.isFeatured || false,
    isBestSeller: product?.isBestSeller || false,
    promoTag: {
      enabled: product?.promoTag?.enabled || false,
      percentage: product?.promoTag?.percentage || '',
    },
    images: product?.images || [],
  });

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('basic');

  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    // Auto-generate slug from name
    if (!product && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, product]);

  const fetchOptions = async () => {
    try {
      const [categoriesData, collectionsData] = await Promise.all([
        categoryService.getAllCategories(),
        collectionService.getAllCollections(),
      ]);
      
      // ✅ Handle different response formats
      const cats = Array.isArray(categoriesData) ? categoriesData : 
                   categoriesData?.data || categoriesData?.categories || [];
      const cols = Array.isArray(collectionsData) ? collectionsData : 
                   collectionsData?.data || collectionsData?.collections || [];
      
      setCategories(cats);
      setCollections(cols);
    } catch (error) {
      console.error('Error fetching options:', error);
      setCategories([]);
      setCollections([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreviews.length > 5) {
      setError('Maximum 5 images autorisées');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('Chaque image ne doit pas dépasser 5MB');
        return;
      }
    });

    setImageFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then(previews => {
      setImagePreviews(prev => [...prev, ...previews]);
    });

    setError('');
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput('');
    }
  };

  const handleRemoveColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color),
    }));
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !formData.sizes.available.includes(sizeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: {
          ...prev.sizes,
          available: [...prev.sizes.available, sizeInput.trim()],
        },
      }));
      setSizeInput('');
    }
  };

  const handleRemoveSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        available: prev.sizes.available.filter(s => s !== size),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload images if any
      let imageUrls = [...formData.images];
      if (imageFiles.length > 0) {
        const uploadFormData = new FormData();
        imageFiles.forEach(file => uploadFormData.append('images', file));
        const uploadResponse = await productService.uploadImages(uploadFormData);
        imageUrls = [...imageUrls, ...uploadResponse.urls];
      }

      const productData = {
        ...formData,
        images: imageUrls,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        promoTag: {
          enabled: formData.promoTag.enabled,
          percentage: formData.promoTag.enabled ? parseFloat(formData.promoTag.percentage) : 0,
        },
      };

      if (product) {
        await productService.updateProduct(product._id, productData);
      } else {
        await productService.createProduct(productData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Informations de base' },
    { id: 'media', label: 'Images' },
    { id: 'variants', label: 'Variantes' },
    { id: 'settings', label: 'Paramètres' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Info Tab */}
          {currentTab === 'basic' && (
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Ex: Chemise en soie blanche"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
                  placeholder="chemise-en-soie-blanche"
                  readOnly={!!product}
                />
                <p className="text-xs text-gray-500 mt-1">Généré automatiquement depuis le nom</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Description détaillée du produit..."
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Prix (TND) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* Category & Collection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {Array.isArray(categories) && categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Collection
                  </label>
                  <select
                    name="collection"
                    value={formData.collection}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Aucune collection</option>
                    {Array.isArray(collections) && collections.map(col => (
                      <option key={col._id} value={col._id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {currentTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Images du produit (minimum 2, maximum 5) *
                </label>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imagePreviews.length < 5 && (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Cliquez pour ajouter des images</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {imagePreviews.length}/5 images
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  La première image sera utilisée comme image principale
                </p>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {currentTab === 'variants' && (
            <div className="space-y-6">
              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Couleurs disponibles
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Ex: Noir, Blanc, Bleu..."
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg"
                    >
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Type de taille
                </label>
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sizes.type"
                      value="letter"
                      checked={formData.sizes.type === 'letter'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Lettres (XS, S, M, L, XL, XXL)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sizes.type"
                      value="numeric"
                      checked={formData.sizes.type === 'numeric'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Numérique (34, 36, 38, 40, 42, 44)</span>
                  </label>
                </div>

                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tailles disponibles
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder={formData.sizes.type === 'letter' ? 'Ex: S, M, L...' : 'Ex: 36, 38, 40...'}
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.available.map((size, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              {/* Featured & Best Seller */}
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    <strong>Produit en vedette</strong> (affiché dans "Nouvelle Collection")
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    <strong>Meilleure vente</strong> (affiché dans "Meilleurs Ventes")
                  </span>
                </label>
              </div>

              {/* Promo Tag */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="promoTag.enabled"
                    checked={formData.promoTag.enabled}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-900">
                    Activer une promotion
                  </span>
                </label>

                {formData.promoTag.enabled && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Pourcentage de réduction (%)
                    </label>
                    <input
                      type="number"
                      name="promoTag.percentage"
                      value={formData.promoTag.percentage}
                      onChange={handleInputChange}
                      min="1"
                      max="99"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Ex: 20"
                    />
                    {formData.price && formData.promoTag.percentage && (
                      <p className="text-sm text-gray-600 mt-2">
                        Prix après réduction:{' '}
                        <strong>
                          {(formData.price * (1 - formData.promoTag.percentage / 100)).toFixed(2)} TND
                        </strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || imagePreviews.length < 2}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
