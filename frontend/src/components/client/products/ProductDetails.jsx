// frontend/src/components/client/products/ProductDetails.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ZoomIn,
  Ruler,
  Package,
  Check,
  X,
  Facebook,
  Twitter,
  Copy
} from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

const ProductDetails = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [notification, setNotification] = useState(null);
  
  const { addToCart } = useCart();

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

const handleAddToCart = async () => {
  const hasColors = product.colors && product.colors.length > 0;

  // Parse stored color string "Label|#hex" or legacy French name
  const frenchColorMap = {
    'Noir': '#000000', 'Blanc': '#FFFFFF', 'Rouge': '#E53E3E', 'Bleu': '#3B82F6',
    'Vert': '#22C55E', 'Jaune': '#EAB308', 'Rose': '#EC4899', 'Gris': '#6B7280',
    'Marron': '#92400E', 'Orange': '#F97316', 'Beige': '#D2B48C', 'Crème': '#FFFDD0',
    'Marine': '#1E3A5F', 'Bordeaux': '#800020', 'Camel': '#C19A6B',
  };
  const parseColor = (colorStr) => {
    if (!colorStr) return { label: colorStr, hex: '#cccccc' };
    if (colorStr.includes('|')) {
      const [label, hex] = colorStr.split('|');
      return { label, hex };
    }
    return { label: colorStr, hex: frenchColorMap[colorStr] || '#cccccc' };
  };
  const hasSizes = product.sizes && product.sizes.length > 0;
  
  // Only validate if product has these options
  if (hasColors && !selectedColor) {
    showNotif('Veuillez sélectionner une couleur', 'error');
    return;
  }
  
  if (hasSizes && !selectedSize) {
    showNotif('Veuillez sélectionner une taille', 'error');
    return;
  }

  const result = await addToCart(product, quantity, selectedColor, selectedSize);
  if (result.success) {
    showNotif('Produit ajouté au panier avec succès! 🎉', 'success');
  } else {
    showNotif(result.error || 'Erreur lors de l\'ajout au panier', 'error');
  }
};

// Also update the initialization at the top:
const hasColors = product.colors && product.colors.length > 0;
const hasSizes = product.sizes && product.sizes.length > 0;

const [selectedColor, setSelectedColor] = useState(hasColors ? product.colors[0] : 'default');
const [selectedSize, setSelectedSize] = useState(hasSizes ? product.sizes[0] : 'default');

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showNotif(
      isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris ❤️',
      'success'
    );
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Découvrez ${product.name} sur Pavone Collection`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        showNotif('Lien copié dans le presse-papier!', 'success');
        break;
    }
    setShowShareMenu(false);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock && quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const finalPrice = product.comparePrice && product.comparePrice > product.price
    ? product.price
    : product.price;

  const discountPercentage = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const reviews = [
    {
      id: 1,
      name: 'Sophie Martin',
      rating: 5,
      date: '2026-01-15',
      comment: 'Excellent produit! La qualité est au rendez-vous. Je recommande vivement.',
      verified: true,
    },
    {
      id: 2,
      name: 'Lucas Dubois',
      rating: 4,
      date: '2026-01-10',
      comment: 'Très satisfait de mon achat. Le produit correspond parfaitement à la description.',
      verified: true,
    },
  ];

  const sizeGuideData = [
    { size: 'XS', chest: '81-86', waist: '61-66', hips: '86-91' },
    { size: 'S', chest: '86-91', waist: '66-71', hips: '91-96' },
    { size: 'M', chest: '91-96', waist: '71-76', hips: '96-101' },
    { size: 'L', chest: '96-102', waist: '76-82', hips: '101-107' },
    { size: 'XL', chest: '102-109', waist: '82-89', hips: '107-114' },
  ];

  return (
    <>
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-2xl ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 group"
          >
            <img
              src={product.images?.[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isImageZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            />

            {discountPercentage > 0 && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-xl">
                -{discountPercentage}%
              </div>
            )}

            {product.images && product.images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}

            <div className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </div>
          </motion.div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-purple-600 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category?.name && (
              <span className="inline-block text-sm text-purple-600 font-semibold uppercase tracking-wider mb-3">
                {product.category.name}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {product.rating?.average && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.floor(product.rating.average)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating.average} ({product.rating.count} avis)
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {finalPrice} TND
              </span>
              {discountPercentage > 0 && (
                <span className="text-2xl text-gray-400 line-through">
                  {product.comparePrice} TND
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm mb-6">
              {product.stock > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-semibold">
                    En stock ({product.stock} disponibles)
                  </span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 font-semibold">Rupture de stock</span>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-gray-900">
                  Couleur: <span className="text-purple-600">{parseColor(selectedColor).label}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => {
                  const { label, hex } = parseColor(color);
                  return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color)}
                    title={label}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-purple-600 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {selectedColor === color && (
                      <Check className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg" />
                    )}
                  </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-gray-900">
                  Taille: {selectedSize && <span className="text-purple-600">{selectedSize}</span>}
                </label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
                >
                  <Ruler className="w-4 h-4" />
                  Guide des tailles
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-4">
              Quantité
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-3 text-gray-700 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                <span className="px-6 text-lg font-bold text-gray-900">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock || quantity >= 10}
                  className="p-3 text-gray-700 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
              <span className="text-sm text-gray-600">
                ({product.stock} disponibles)
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Package className="w-6 h-6" />
              {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlist}
              className={`p-4 rounded-xl font-bold transition-all ${
                isWishlisted
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-white' : ''}`} />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 space-y-2 min-w-[200px] z-20"
                  >
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                    >
                      <Facebook className="w-5 h-5" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sky-50 rounded-lg transition-colors text-sky-600"
                    >
                      <Twitter className="w-5 h-5" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                    >
                      <Copy className="w-5 h-5" />
                      <span>Copier le lien</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Tabs */}
          <div className="pt-6">
            <div className="flex gap-2 border-b border-gray-200 mb-6">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'reviews' ? `Avis (${reviews.length})` : tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">Matière</span>
                      <span className="text-gray-600">{product.materials?.join(', ') || '100% Coton Premium'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">Entretien</span>
                      <span className="text-gray-600">{product.careInstructions || 'Lavage en machine à 30°C'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">SKU</span>
                      <span className="text-gray-600">{product.sku || product._id?.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-6 bg-gray-50 rounded-2xl">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-900">{review.name}</h4>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                  Achat vérifié
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                  <Star
                                    key={index}
                                    className={`w-4 h-4 ${
                                      index < review.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Guide des tailles</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Taille</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Poitrine (cm)</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Taille (cm)</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Hanches (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuideData.map((row) => (
                      <tr key={row.size} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-purple-600">{row.size}</td>
                        <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                        <td className="px-4 py-3 text-gray-600">{row.waist}</td>
                        <td className="px-4 py-3 text-gray-600">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-sm text-gray-600">
                * Les mesures sont données en centimètres. Pour plus de précision, prenez vos mesures avec un mètre ruban.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails;
