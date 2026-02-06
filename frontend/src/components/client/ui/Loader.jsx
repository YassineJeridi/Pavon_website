// frontend/src/components/client/ui/Loader.jsx

const Loader = ({ 
  size = 'md', 
  color = 'gray', 
  fullScreen = false,
  text = '' 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const colors = {
    gray: 'border-gray-900',
    white: 'border-white',
    blue: 'border-blue-600',
    red: 'border-red-600',
    green: 'border-green-600',
  };

  const spinnerClass = `
    ${sizes[size]}
    border-4 border-t-transparent
    ${colors[color]}
    rounded-full
    animate-spin
  `;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={spinnerClass} />
      {text && (
        <p className="text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
