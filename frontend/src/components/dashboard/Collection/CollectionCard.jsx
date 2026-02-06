import { Package, Eye, EyeOff, Star } from 'lucide-react';

const CollectionCard = ({ collection, onViewProducts, onToggleFeatured, onToggleActive, onEdit, onDelete }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'https://pavon-website.onrender.com/api';
  const imageUrl = collection.image?.startsWith('http') 
    ? collection.image 
    : `${API_URL}${collection.image}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={imageUrl} 
          alt={collection.name}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {collection.isFeatured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Star className="w-3 h-3" /> Vedette
            </span>
          )}
          <span className={`px-2 py-1 rounded text-xs ${collection.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
            {collection.isActive ? 'Actif' : 'Inactif'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{collection.description}</p>
        
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
          <Package className="w-4 h-4" />
          <span>{collection.productCount || 0} produit(s)</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewProducts(collection)}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
          >
            Produits
          </button>
          <button
            onClick={() => onToggleFeatured(collection._id)}
            className="px-3 py-2 rounded border hover:bg-gray-50"
            title="Basculer vedette"
          >
            <Star className={`w-4 h-4 ${collection.isFeatured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={() => onToggleActive(collection._id)}
            className="px-3 py-2 rounded border hover:bg-gray-50"
            title="Basculer actif"
          >
            {collection.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
