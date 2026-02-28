import { X, Unlink } from 'lucide-react';
import { useState } from 'react';

const CollectionProductsModal = ({ collection, products, onClose, onDissociate }) => {
  const [loading, setLoading] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://backend.pavonecollection.com/api';

  const handleDissociate = async (productId) => {
    if (!confirm('Dissocier ce produit de la collection ?')) return;
    setLoading(productId);
    await onDissociate(collection._id, productId);
    setLoading(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Produits - {collection.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {products.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun produit dans cette collection</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Image</th>
                  <th className="text-left p-3">Nom</th>
                  <th className="text-left p-3">Prix</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const imageUrl = product.images?.[0]?.startsWith('http')
                    ? product.images[0]
                    : `${API_URL}${product.images?.[0]}`;

                  return (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <img 
                          src={imageUrl} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Image'}
                        />
                      </td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.price.toFixed(2)} TND</td>
                      <td className="p-3">{product.stock}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDissociate(product._id)}
                          disabled={loading === product._id}
                          className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 disabled:opacity-50"
                          title="Dissocier"
                        >
                          <Unlink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionProductsModal;
