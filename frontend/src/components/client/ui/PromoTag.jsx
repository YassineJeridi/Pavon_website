// frontend/src/components/client/ui/PromoTag.jsx

const PromoTag = ({ percentage, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center
        bg-red-600 text-white font-bold rounded-lg
        shadow-lg
        ${sizes[size]}
        ${className}
      `}
    >
      <span>-{percentage}%</span>
    </div>
  );
};

export default PromoTag;
