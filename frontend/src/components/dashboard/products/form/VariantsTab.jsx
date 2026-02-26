// frontend/src/components/dashboard/products/form/VariantsTab.jsx

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const VariantsTab = ({ 
  formData, 
  handleInputChange,
  colorInput,
  setColorInput,
  addColor,
  removeColor,
  sizeInput,
  setSizeInput,
  addSize,
  removeSize
}) => {
  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Couleurs disponibles *
        </label>
        
        {/* Color List */}
        {formData.colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.colors.map((color, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-lg"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="hover:text-red-500"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Color */}
        <div className="flex gap-2">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="Ex: Noir, Rouge, Bleu"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
          />
          <button
            type="button"
            onClick={addColor}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Tailles disponibles *
        </label>

        {/* Size Type */}
        <div className="flex gap-4 mb-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="sizes.type"
              value="letter"
              checked={formData.sizes.type === 'letter'}
              onChange={handleInputChange}
              className="mr-2"
            />
            Lettres (S, M, L, XL)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="sizes.type"
              value="number"
              checked={formData.sizes.type === 'number'}
              onChange={handleInputChange}
              className="mr-2"
            />
            Chiffres (38, 40, 42, etc.)
          </label>
        </div>

        {/* Size List */}
        {formData.sizes.available.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.sizes.available.map((size, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-lg"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="hover:text-red-500"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Size */}
        <div className="flex gap-2">
          <input
            type="text"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder={formData.sizes.type === 'letter' ? "Ex: S, M, L" : "Ex: 38, 40, 42"}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
          />
          <button
            type="button"
            onClick={addSize}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantsTab;
