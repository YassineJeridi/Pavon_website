// frontend/src/components/dashboard/products/form/MediaTab.jsx

import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

const MediaTab = ({ 
  imagePreviews, 
  handleImageChange, 
  removeImage 
}) => {
  return (
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
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {imagePreviews.length < 5 && (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            >
              <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Cliquez pour ajouter des images
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {imagePreviews.length} / 5 images
              </span>
            </label>
          </div>
        )}

        {imagePreviews.length < 2 && (
          <p className="text-sm text-red-500 mt-2">
            Minimum 2 images requises
          </p>
        )}
      </div>
    </div>
  );
};

export default MediaTab;
