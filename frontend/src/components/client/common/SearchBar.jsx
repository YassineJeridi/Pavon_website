// frontend/src/components/client/common/SearchBar.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import  productService  from '../../../services/productService';

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await productService.searchProducts(query);
        setResults(data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleProductClick = (slug) => {
    navigate(`/produits/${slug}`);
    onClose();
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-3xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden animate-slideDown">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 p-4">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher des produits..."
              className="flex-1 outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="ml-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-gray-500">
                Recherche en cours...
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Aucun produit trouvé pour "{query}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="divide-y divide-gray-100">
                {results.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product.slug)}
                    className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.price} TND
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.length < 2 && (
              <div className="p-8 text-center text-gray-400">
                Saisissez au moins 2 caractères pour rechercher
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
