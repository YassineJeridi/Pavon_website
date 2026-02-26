// frontend/src/components/dashboard/externalOrders/FinancialMetrics.jsx
// Displays Chiffre d'affaires, Charges, and Montant net cards

import {
  BanknotesIcon,
  ArrowTrendingDownIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

const formatTND = (value) =>
  new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
  }).format(value || 0);

const FinancialMetrics = ({ metrics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow border-2 border-[#e8ddca] animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Chiffre d'affaires",
      sublabel: `${metrics?.orderCount || 0} commandes`,
      value: metrics?.totalRevenue || 0,
      icon: BanknotesIcon,
      borderColor: 'border-green-300',
      textColor: 'text-green-600',
      bgGradient: 'from-green-50 to-white',
    },
    {
      label: 'Les charges',
      sublabel: 'Total des dépenses',
      value: metrics?.totalExpenses || 0,
      icon: ArrowTrendingDownIcon,
      borderColor: 'border-red-300',
      textColor: 'text-red-600',
      bgGradient: 'from-red-50 to-white',
    },
    {
      label: 'Montant net',
      sublabel: (metrics?.netProfit || 0) >= 0 ? 'Bénéfice' : 'Perte',
      value: metrics?.netProfit || 0,
      icon: ScaleIcon,
      borderColor: (metrics?.netProfit || 0) >= 0 ? 'border-blue-300' : 'border-red-300',
      textColor: (metrics?.netProfit || 0) >= 0 ? 'text-blue-600' : 'text-red-600',
      bgGradient: (metrics?.netProfit || 0) >= 0 ? 'from-blue-50 to-white' : 'from-red-50 to-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-6 shadow-lg border-2 ${card.borderColor} hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-medium">{card.label}</p>
              <Icon className={`w-8 h-8 ${card.textColor} opacity-50`} />
            </div>
            <p className={`text-3xl font-bold ${card.textColor}`}>
              {formatTND(card.value)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{card.sublabel}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FinancialMetrics;
