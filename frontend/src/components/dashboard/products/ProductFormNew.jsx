// frontend/src/components/dashboard/products/ProductFormNew.jsx

import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, PlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import { collectionService } from '../../../services/collectionService';
import { getProductImageUrl } from '../../../utils/imageUtils';

const ProductFormNew = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    categories: product?.categories?.map(c => c._id) || [],
    productCollection: product?.productCollection?._id || '',
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    images: product?.images || [],
    featured: product?.featured || false,
    bestseller: product?.bestseller || false,
    promoPercentage: product?.promoTag?.percentage || '',
    sizeType: '', // 'letter' or 'numeric' - will be set based on existing sizes
  });

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState(product?.images?.map(img => getProductImageUrl({ images: [img] })) || []);
  const [imageFiles, setImageFiles] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Predefined options
  const predefinedColors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Gris', 'Marron', 'Orange'];
  const predefinedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
  const numericSizes = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'];

  // Determine size type on mount if editing
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      const firstSize = product.sizes[0];
      if (predefinedSizes.includes(firstSize)) {
        setFormData(prev => ({ ...prev, sizeType: 'letter' }));
      } else if (numericSizes.includes(firstSize)) {
        setFormData(prev => ({ ...prev, sizeType: 'numeric' }));
      }
    }
  }, [product]);

  useEffect(() => {
    fetchOptions();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (!product && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, product]);

  const fetchOptions = async () => {
    try {
      const [categoriesRes, collectionsRes] = await Promise.all([
        categoryService.getAllCategories(),
        collectionService.getAllCollections(),
      ]);

      console.log('📦 Categories response:', categoriesRes);
      console.log('📦 Collections response:', collectionsRes);

      // Extract categories array
      let categoriesArray = [];
      if (Array.isArray(categoriesRes)) {
        categoriesArray = categoriesRes;
      } else if (categoriesRes?.data && Array.isArray(categoriesRes.data)) {
        categoriesArray = categoriesRes.data;
      } else if (categoriesRes?.categories && Array.isArray(categoriesRes.categories)) {
        categoriesArray = categoriesRes.categories;
      }

      // Extract collections array - handle nested data structure
      let collectionsArray = [];
      if (Array.isArray(collectionsRes)) {
        collectionsArray = collectionsRes;
      } else if (collectionsRes?.data) {
        // Check if data is an array or an object with data property
        if (Array.isArray(collectionsRes.data)) {
          collectionsArray = collectionsRes.data;
        } else if (collectionsRes.data.data && Array.isArray(collectionsRes.data.data)) {
          collectionsArray = collectionsRes.data.data;
        } else if (collectionsRes.data.collections && Array.isArray(collectionsRes.data.collections)) {
          collectionsArray = collectionsRes.data.collections;
        }
      } else if (collectionsRes?.collections && Array.isArray(collectionsRes.collections)) {
        collectionsArray = collectionsRes.collections;
      }

      console.log('✅ Categories array:', categoriesArray.length);
      console.log('✅ Collections array:', collectionsArray.length);
      console.log('✅ Collections data:', collectionsArray);

      setCategories(categoriesArray);
      setCollections(collectionsArray);
    } catch (error) {
      console.error('❌ Error fetching options:', error);
      setCategories([]);
      setCollections([]);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = imagePreviews.length + files.length;

    if (totalImages > 5) {
      setError('Maximum 5 images autorisées');
      return;
    }

    setImageFiles(prev => [...prev, ...files]);

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const removeImage = (index) => {
    const isExistingImage = index < (product?.images?.length || 0);

    if (isExistingImage) {
      // Remove from existing images
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      // Remove from new image files
      const fileIndex = index - (product?.images?.length || 0);
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      console.log('🔵 Starting product submission...');

      // Validation
      if (!formData.name || !formData.price || !formData.stock) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (imagePreviews.length < 2) {
        throw new Error('Au moins 2 images sont requises');
      }

      if (formData.categories.length === 0) {
        throw new Error('Veuillez sélectionner au moins une catégorie');
      }

      setUploadProgress(20);
      console.log('🔵 Validation passed');

      // Create FormData to send everything including images in one request
      const submitFormData = new FormData();

      // Add all text fields
      submitFormData.append('name', formData.name);
      submitFormData.append('slug', formData.slug);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', parseFloat(formData.price));
      submitFormData.append('stock', parseInt(formData.stock));
      submitFormData.append('categories', JSON.stringify(formData.categories));
      
      // Only add productCollection if it has a value
      if (formData.productCollection && formData.productCollection.trim() !== '') {
        submitFormData.append('productCollection', formData.productCollection);
      }
      
      submitFormData.append('colors', JSON.stringify(formData.colors));
      submitFormData.append('sizes', JSON.stringify(formData.sizes));
      submitFormData.append('featured', formData.featured);
      submitFormData.append('bestseller', formData.bestseller);
      submitFormData.append('promoTag', JSON.stringify({
        enabled: formData.promoPercentage > 0,
        percentage: parseFloat(formData.promoPercentage) || 0,
      }));

      console.log('🔵 Form data prepared:', {
        name: formData.name,
        categories: formData.categories,
        colors: formData.colors,
        sizes: formData.sizes,
        imageFiles: imageFiles.length,
        existingImages: formData.images?.length || 0,
      });

      // Add new image files
      console.log('🔵 Adding image files:', imageFiles.length);
      imageFiles.forEach((file, index) => {
        console.log(`🔵 Adding image ${index + 1}:`, file.name, file.size);
        submitFormData.append('images', file);
      });

      setUploadProgress(40);
      console.log('🔵 Sending request...');

      // Send single request with all data
      if (product) {
        console.log('🔵 Updating product:', product._id);
        await productService.updateProduct(product._id, submitFormData);
      } else {
        console.log('🔵 Creating new product');
        await productService.createProduct(submitFormData);
      }

      console.log('✅ Product saved successfully!');
      setUploadProgress(100);
      onSuccess();
    } catch (error) {
      console.error('❌ Error saving product:', error);
      console.error('❌ Error details:', error.response?.data);
      setError(error.message || error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const toggleCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()]
      }));
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const toggleSize = (size) => {
    // Determine the type of size being selected
    const isLetterSize = predefinedSizes.includes(size);
    const isNumericSize = numericSizes.includes(size);
    const newSizeType = isLetterSize ? 'letter' : 'numeric';

    setFormData(prev => {
      // If no size type set yet, set it
      if (!prev.sizeType) {
        return {
          ...prev,
          sizeType: newSizeType,
          sizes: [size]
        };
      }

      // If trying to mix size types, clear previous sizes and start fresh
      if (prev.sizeType !== newSizeType) {
        return {
          ...prev,
          sizeType: newSizeType,
          sizes: [size]
        };
      }

      // Same size type - toggle normally
      return {
        ...prev,
        sizes: prev.sizes.includes(size)
          ? prev.sizes.filter(s => s !== size)
          : [...prev.sizes, size]
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Remplissez les informations ci-dessous pour {product ? 'modifier' : 'créer'} le produit
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Ex: T-shirt Premium Coton"
                  required
                  disabled={loading}
                />
              </div>

              {/* Slug (auto-generated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="auto-généré"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  placeholder="Décrivez le produit..."
                  required
                  disabled={loading}
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (TND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="0.00"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="0"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Promo Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réduction (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.promoPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, promoPercentage: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="0"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Laissez vide ou 0 si aucune réduction</p>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégories <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {!Array.isArray(categories) || categories.length === 0 ? (
                    <p className="text-sm text-gray-500">Chargement...</p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category._id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(category._id)}
                            onChange={() => toggleCategory(category._id)}
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Collection (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection (optionnel)
                </label>
                <select
                  value={formData.productCollection}
                  onChange={(e) => setFormData(prev => ({ ...prev, productCollection: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Aucune collection</option>
                  {Array.isArray(collections) && collections.map(collection => (
                    <option key={collection._id} value={collection._id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column - Images, Colors, Sizes */}
            <div className="space-y-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (2-5 images) <span className="text-red-500">*</span>
                </label>

                {/* Image Preview Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Image';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={loading}
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Upload Button */}
                  {imagePreviews.length < 5 && (
                    <label className="w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Upload en cours...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  {imagePreviews.length}/5 images • Format: JPG, PNG • Max 5MB par image
                </p>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleurs disponibles
                </label>

                {/* Quick Select Predefined Colors */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Sélection rapide:</p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (!formData.colors.includes(color)) {
                            setFormData(prev => ({ ...prev, colors: [...prev.colors, color] }));
                          }
                        }}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.colors.includes(color)
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }`}
                        disabled={loading}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Ou entrez une couleur personnalisée..."
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    disabled={loading}
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Selected Colors * <span className="text-red-500">*</span>
                </label>
                
                {formData.sizeType && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Type actuel:</strong> {formData.sizeType === 'letter' ? 'Tailles lettres' : 'Tailles numériques'}
                      <br />
                      <span className="text-blue-600">Cliquez sur l'autre type pour changer (les tailles actuelles seront effacées)</span>
                    </p>
                  </div>
                )}

                {/* Letter Sizes */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Tailles lettres:</p>
                    {formData.sizeType === 'numeric' && (
                      <span className="text-xs text-orange-600 font-medium">
                        ⚠️ Désactivé (tailles numériques sélectionnées)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {predefinedSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        disabled={formData.sizeType === 'numeric' && !formData.sizes.includes(size)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          formData.sizes.includes(size)
                            ? 'bg-gray-900 text-white border-gray-900'
                            : formData.sizeType === 'numeric'
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numeric Sizes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Tailles numériques:</p>
                    {formData.sizeType === 'letter' && (
                      <span className="text-xs text-orange-600 font-medium">
                        ⚠️ Désactivé (tailles lettres sélectionnées)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {numericSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        disabled={formData.sizeType === 'letter' && !formData.sizes.includes(size)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          formData.sizes.includes(size)
                            ? 'bg-gray-900 text-white border-gray-900'
                            : formData.sizeType === 'letter'
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numeric Sizes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Tailles numériques:</p>
                    {formData.sizeType === 'letter' && (
                      <span className="text-xs text-orange-600 font-medium">
                        ⚠️ Désactivé (tailles lettres sélectionnées)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {numericSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        disabled={formData.sizeType === 'letter' && !formData.sizes.includes(size)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          formData.sizes.includes(size)
                            ? 'bg-gray-900 text-white border-gray-900'
                            : formData.sizeType === 'letter'
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.sizes.length > 0 && (
                  <p className="text-xs text-gray-600 mt-3">
                    {formData.sizes.length} taille(s) sélectionnée(s): {formData.sizes.join(', ')}
                  </p>
                )}
              </div>

              {/* Settings */}
              <div className="border-t pt-6 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-900">Produit en vedette</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData(prev => ({ ...prev, bestseller: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-900">Best-seller</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {uploadProgress > 0 ? 'Upload...' : 'Enregistrement...'}
                </span>
              ) : (
                product ? 'Mettre à jour' : 'Créer le produit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormNew;
