// frontend/src/layout/LoadingLayout.jsx

const LoadingLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {/* Logo or Brand */}
        <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8">
          Élégance
        </h1>

        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 animate-pulse">Chargement...</p>
      </div>
    </div>
  );
};

export default LoadingLayout;
