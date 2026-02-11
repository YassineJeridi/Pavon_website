// frontend/src/components/dashboard/externalOrders/RecurringClients.jsx
// Displays recurring clients with order count, total spent, and order history

import { useState } from 'react';
import {
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const formatTND = (value) =>
  new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
  }).format(value || 0);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const RecurringClients = ({ clients, onViewHistory, clientOrders, loadingHistory, loading }) => {
  const [expandedClient, setExpandedClient] = useState(null);

  const handleToggle = (clientName) => {
    if (expandedClient === clientName) {
      setExpandedClient(null);
    } else {
      setExpandedClient(clientName);
      onViewHistory(clientName);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserGroupIcon className="w-7 h-7 text-[#5d1115]" />
          <h3 className="text-xl font-bold text-[#111f35]">Clients récurrents</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] overflow-hidden">
      <div className="p-6 border-b border-[#e8ddca]">
        <div className="flex items-center gap-3">
          <UserGroupIcon className="w-7 h-7 text-[#5d1115]" />
          <h3 className="text-xl font-bold text-[#111f35]">
            Clients récurrents ({clients?.length || 0})
          </h3>
        </div>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Aucun client récurrent</p>
          <p className="text-sm mt-1">Les clients apparaîtront ici après plusieurs commandes</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {clients.map((client) => (
            <div key={client._id} className="group">
              {/* Client row */}
              <button
                onClick={() => handleToggle(client.customerName)}
                className="w-full flex items-center justify-between p-5 hover:bg-[#fdf9ee] transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5d1115] to-[#8d1619] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {client.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111f35]">{client.customerName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {client.orderCount} commande{client.orderCount > 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        Dernière: {formatDate(client.lastOrderDate)}
                      </span>
                      {client.sources && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            via {client.sources.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#5d1115] text-lg">
                    {formatTND(client.totalSpent)}
                  </span>
                  {expandedClient === client.customerName ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded order history */}
              {expandedClient === client.customerName && (
                <div className="px-5 pb-5 bg-[#fdf9ee]">
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5d1115]" />
                    </div>
                  ) : !clientOrders || clientOrders.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4 text-center">
                      Aucun historique trouvé
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#e8ddca]">
                            <th className="text-left py-2 px-3 text-gray-600 font-medium">Date</th>
                            <th className="text-left py-2 px-3 text-gray-600 font-medium">Source</th>
                            <th className="text-right py-2 px-3 text-gray-600 font-medium">Montant</th>
                            <th className="text-left py-2 px-3 text-gray-600 font-medium">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientOrders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-100">
                              <td className="py-2 px-3 text-gray-600">{formatDate(order.date)}</td>
                              <td className="py-2 px-3 text-gray-600">{order.source}</td>
                              <td className="py-2 px-3 text-right font-semibold text-[#111f35]">
                                {formatTND(order.amount)}
                              </td>
                              <td className="py-2 px-3 text-gray-500 truncate max-w-[200px]">
                                {order.notes || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecurringClients;
