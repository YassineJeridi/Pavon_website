// frontend/src/components/dashboard/externalOrders/OrdersTable.jsx
// Card-style external orders list with filters, sorting, and pagination

import { useState } from 'react';
import {
  PencilSquareIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

const ORDER_SOURCES = ['Facebook', 'Instagram', 'WhatsApp', 'Direct Contact', 'Other'];

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

const getSourceStyle = (source) => {
  const styles = {
    Facebook: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    Instagram: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' },
    WhatsApp: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
    'Direct Contact': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    Other: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' },
  };
  return styles[source] || styles.Other;
};

const OrdersTable = ({
  orders,
  pagination,
  filters,
  onFilterChange,
  onSort,
  sortBy,
  sortOrder,
  onEdit,
  onDelete,
  onPageChange,
  loading,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSortClick = (field) => {
    if (sortBy === field) {
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'desc');
    }
  };

  const SortButton = ({ field, label }) => {
    const active = sortBy === field;
    return (
      <button
        onClick={() => handleSortClick(field)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          active
            ? 'bg-[#5d1115] text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {label}
        {active && (sortOrder === 'asc' ? (
          <ChevronUpIcon className="w-3 h-3" />
        ) : (
          <ChevronDownIcon className="w-3 h-3" />
        ))}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#e8ddca]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5d1115]/10 flex items-center justify-center">
              <ShoppingBagIcon className="w-5 h-5 text-[#5d1115]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111f35]">Commandes externes</h3>
              <p className="text-xs text-gray-500">{pagination?.total || 0} résultats</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-[#5d1115] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium mr-1">Trier :</span>
          <SortButton field="date" label="Date" />
          <SortButton field="source" label="Source" />
          <SortButton field="customerName" label="Client" />
          <SortButton field="amount" label="Montant" />
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 mt-4 border-t border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher client..."
                value={filters.search || ''}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none text-sm"
              />
            </div>
            <select
              value={filters.source || ''}
              onChange={(e) => onFilterChange({ ...filters, source: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none text-sm"
            >
              <option value="">Toutes les sources</option>
              {ORDER_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none text-sm"
            />
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none text-sm"
            />
          </div>
        )}
      </div>

      {/* Cards list */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5d1115] mx-auto" />
            <p className="text-gray-500 mt-3 text-sm">Chargement...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingBagIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">Aucune commande trouvée</p>
            <p className="text-sm mt-1">Ajoutez votre première commande externe</p>
          </div>
        ) : (
          orders.map((order) => {
            const s = getSourceStyle(order.source);
            return (
              <div
                key={order._id}
                className="flex items-center gap-4 p-4 hover:bg-[#fdf9ee]/60 transition-colors group"
              >
                {/* Source dot + icon */}
                <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                  <div className={`w-3 h-3 rounded-full ${s.dot}`} />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[#111f35] text-sm truncate">
                      {order.customerName || <span className="text-gray-400 italic">Client anonyme</span>}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                      {order.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{formatDate(order.date)}</span>
                    {order.notes && (
                      <span className="text-xs text-gray-400 truncate max-w-[200px]" title={order.notes}>
                        {order.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[#111f35]">{formatTND(order.amount)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => onEdit(order)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(order._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e8ddca] bg-[#fdf9ee]/40">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold text-[#111f35]">{pagination.page}</span> sur{' '}
            <span className="font-semibold text-[#111f35]">{pagination.pages}</span>
            <span className="ml-2 text-gray-400">• {pagination.total} commandes</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={pagination.page <= 1}
              className="px-2 py-1.5 text-xs rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Première page"
            >
              «
            </button>
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 text-xs rounded-lg font-medium transition-all ${
                    pageNum === pagination.page
                      ? 'bg-[#5d1115] text-white shadow-sm'
                      : 'border border-[#e8ddca] hover:bg-white text-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-1.5 rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.pages)}
              disabled={pagination.page >= pagination.pages}
              className="px-2 py-1.5 text-xs rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Dernière page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
