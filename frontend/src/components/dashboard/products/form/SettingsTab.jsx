// frontend/src/components/dashboard/products/form/SettingsTab.jsx

const SettingsTab = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      {/* Toggles */}
      <div className="space-y-4">
        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div>
            <span className="block font-semibold text-gray-900">Produit en vedette</span>
            <span className="text-sm text-gray-600">Afficher sur la page d'accueil</span>
          </div>
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
            className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
        </label>

        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div>
            <span className="block font-semibold text-gray-900">Meilleures ventes</span>
            <span className="text-sm text-gray-600">Afficher dans la section "Meilleures Ventes"</span>
          </div>
          <input
            type="checkbox"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleInputChange}
            className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
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
  );
};

export default SettingsTab;
