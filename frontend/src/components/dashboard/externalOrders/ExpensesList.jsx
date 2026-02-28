// frontend/src/components/dashboard/externalOrders/ExpensesList.jsx
// Card-style expenses list with pagination

import { useState, useMemo } from 'react';
import {
  PencilSquareIcon,
  TrashIcon,
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const PER_PAGE = 8;

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

const getCategoryStyle = (category) => {
  const styles = {
    'Matières premières': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    'Livraison': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    'Marketing': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    'Loyer': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
    'Salaires': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
    'Autre': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' },
  };
  return styles[category] || styles['Autre'];
};

const ExpensesList = ({ expenses, onEdit, onDelete, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side pagination
  const totalPages = useMemo(() => Math.ceil((expenses?.length || 0) / PER_PAGE), [expenses]);
  const paginatedExpenses = useMemo(() => {
    if (!expenses) return [];
    const start = (currentPage - 1) * PER_PAGE;
    return expenses.slice(start, start + PER_PAGE);
  }, [expenses, currentPage]);

  // Reset to page 1 when expenses change
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [expenses?.length]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <BanknotesIcon className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-[#111f35]">Charges</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-14" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#e8ddca]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <BanknotesIcon className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#111f35]">Charges</h3>
            <p className="text-xs text-gray-500">{expenses?.length || 0} charges enregistrées</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {!expenses || expenses.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          <BanknotesIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Aucune charge enregistrée</p>
          <p className="text-sm mt-1">Ajoutez vos dépenses pour calculer le montant net</p>
        </div>
      ) : (
        <>
          {/* Card rows */}
          <div className="divide-y divide-gray-100">
            {paginatedExpenses.map((expense) => {
              const cat = getCategoryStyle(expense.category);
              return (
                <div
                  key={expense._id}
                  className="flex items-center gap-4 p-4 hover:bg-[#fdf9ee]/60 transition-colors group"
                >
                  {/* Category dot icon */}
                  <div className={`w-10 h-10 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center shrink-0`}>
                    <TagIcon className={`w-4 h-4 ${cat.text}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[#111f35] text-sm truncate">{expense.label}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                        {expense.customCategory && expense.category === 'Autre'
                          ? expense.customCategory
                          : expense.category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
                    {expense.notes && (
                      <span className="text-xs text-gray-400 ml-3 truncate" title={expense.notes}>
                        {expense.notes}
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-red-600">-{formatTND(expense.amount)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#e8ddca] bg-[#fdf9ee]/40">
              <p className="text-xs text-gray-500">
                Page <span className="font-semibold text-[#111f35]">{currentPage}</span> sur{' '}
                <span className="font-semibold text-[#111f35]">{totalPages}</span>
                <span className="ml-2 text-gray-400">• {expenses.length} charges</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage <= 1}
                  className="px-2 py-1.5 text-xs rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-xs rounded-lg font-medium transition-all ${
                        pageNum === currentPage
                          ? 'bg-[#5d1115] text-white shadow-sm'
                          : 'border border-[#e8ddca] hover:bg-white text-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="px-2 py-1.5 text-xs rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpensesList;
