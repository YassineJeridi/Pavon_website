// frontend/src/components/dashboard/common/StatCard.jsx

const StatCard = ({ title, value, icon: Icon, color = 'burgundy' }) => {
  const colorClasses = {
    burgundy: 'bg-[#5d1115]',
    navy: 'bg-[#111f35]',
    cream: 'bg-[#e8ddca]',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  const bgColor = colorClasses[color] || colorClasses.burgundy;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
