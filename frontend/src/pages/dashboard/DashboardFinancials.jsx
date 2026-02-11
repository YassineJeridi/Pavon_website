// frontend/src/pages/dashboard/DashboardFinancials.jsx
// Stats & Expenses page — financial metrics, revenue by source, expenses list, website orders

import { useState, useEffect, useCallback, useMemo } from 'react';
import externalOrderService from '../../services/externalOrderService';
import orderService from '../../services/orderService';
import FinancialMetrics from '../../components/dashboard/externalOrders/FinancialMetrics';
import ExpenseForm from '../../components/dashboard/externalOrders/ExpenseForm';
import ExpensesList from '../../components/dashboard/externalOrders/ExpensesList';
import {
  PlusIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const ORDERS_PER_PAGE = 10;

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

const getStatusStyle = (status) => {
  const styles = {
    'en attente': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'En attente' },
    'on delivery': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'En livraison' },
    'done': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Terminée' },
    'cancelled': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Annulée' },
  };
  return styles[status] || styles['en attente'];
};

const getPaymentBadge = (ps) => {
  const map = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'En attente' },
    paid: { bg: 'bg-green-50', text: 'text-green-700', label: 'Payée' },
    failed: { bg: 'bg-red-50', text: 'text-red-700', label: 'Échouée' },
    refunded: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Remboursée' },
  };
  return map[ps] || map.pending;
};

// ── Website Orders sub-component ─────────────────
const WebsiteOrdersList = ({ orders, loading }) => {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil((orders?.length || 0) / ORDERS_PER_PAGE), [orders]);
  const paginated = useMemo(() => {
    if (!orders) return [];
    const start = (page - 1) * ORDERS_PER_PAGE;
    return orders.slice(start, start + ORDERS_PER_PAGE);
  }, [orders, page]);

  // reset page when data changes
  useEffect(() => {
    setPage(1);
  }, [orders?.length]);

  const webTotal = useMemo(() => (orders || []).reduce((s, o) => s + (o.total || 0), 0), [orders]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <ShoppingCartIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-[#111f35]">Commandes du site web</h3>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <ShoppingCartIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111f35]">Commandes du site web</h3>
              <p className="text-xs text-gray-500">{orders?.length || 0} commandes</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total CA site</p>
            <p className="text-lg font-bold text-[#111f35]">{formatTND(webTotal)}</p>
          </div>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          <ShoppingCartIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Aucune commande du site</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {paginated.map((order) => {
              const st = getStatusStyle(order.status);
              const pay = getPaymentBadge(order.paymentStatus);
              return (
                <div
                  key={order._id}
                  className="flex items-center gap-4 p-4 hover:bg-[#fdf9ee]/60 transition-colors"
                >
                  {/* Order number icon */}
                  <div className={`w-10 h-10 rounded-xl ${st.bg} border ${st.border} flex items-center justify-center shrink-0`}>
                    <span className={`text-xs font-bold ${st.text}`}>#</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[#111f35] text-sm">
                        {order.orderNumber || order._id?.slice(-6)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                        {st.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full ${pay.bg} ${pay.text}`}>
                        {pay.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 font-medium">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                      <span className="text-xs text-gray-400">
                        {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#111f35]">{formatTND(order.total)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#e8ddca] bg-[#fdf9ee]/40">
              <p className="text-xs text-gray-500">
                Page <span className="font-semibold text-[#111f35]">{page}</span> sur{' '}
                <span className="font-semibold text-[#111f35]">{totalPages}</span>
                <span className="ml-2 text-gray-400">• {orders.length} commandes</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page <= 1}
                  className="px-2 py-1.5 text-xs rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 text-xs rounded-lg font-medium transition-all ${
                        pageNum === page
                          ? 'bg-[#5d1115] text-white shadow-sm'
                          : 'border border-[#e8ddca] hover:bg-white text-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-[#e8ddca] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
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

const DashboardFinancials = () => {
  // ── State ──────────────────────────────────────
  const [metrics, setMetrics] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [websiteOrders, setWebsiteOrders] = useState([]);

  // Loading states
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingWebOrders, setLoadingWebOrders] = useState(true);

  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Notification
  const [notification, setNotification] = useState(null);

  // ── Page title ─────────────────────────────────
  useEffect(() => {
    document.title = 'Statistiques & Charges - Pavon Admin';
  }, []);

  // ── Notifications ──────────────────────────────
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── Fetch functions ────────────────────────────
  const fetchMetrics = useCallback(async () => {
    try {
      setLoadingMetrics(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await externalOrderService.getFinancialMetrics(params);
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoadingMetrics(false);
    }
  }, [startDate, endDate]);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoadingExpenses(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await externalOrderService.getAllExpenses(params);
      if (response.success) {
        setExpenses(response.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoadingExpenses(false);
    }
  }, [startDate, endDate]);

  const fetchWebsiteOrders = useCallback(async () => {
    try {
      setLoadingWebOrders(true);
      const response = await orderService.getAllOrders();
      if (response.success) {
        let data = response.data || response.orders || [];
        // Filter by date range if provided
        if (startDate) {
          const start = new Date(startDate);
          data = data.filter((o) => new Date(o.createdAt) >= start);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          data = data.filter((o) => new Date(o.createdAt) <= end);
        }
        setWebsiteOrders(data);
      }
    } catch (error) {
      console.error('Error fetching website orders:', error);
    } finally {
      setLoadingWebOrders(false);
    }
  }, [startDate, endDate]);

  // ── Effects ────────────────────────────────────
  useEffect(() => {
    fetchMetrics();
    fetchExpenses();
    fetchWebsiteOrders();
  }, [fetchMetrics, fetchExpenses, fetchWebsiteOrders]);

  const refreshAll = () => {
    fetchMetrics();
    fetchExpenses();
    fetchWebsiteOrders();
  };

  // ── Expense handlers ───────────────────────────
  const handleCreateExpense = async (data) => {
    try {
      const response = await externalOrderService.createExpense(data);
      if (response.success) {
        showNotification('Charge créée avec succès');
        setShowExpenseForm(false);
        refreshAll();
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de la création', 'error');
    }
  };

  const handleUpdateExpense = async (data) => {
    try {
      const response = await externalOrderService.updateExpense(editingExpense._id, data);
      if (response.success) {
        showNotification('Charge mise à jour avec succès');
        setEditingExpense(null);
        refreshAll();
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette charge ?')) return;
    try {
      const response = await externalOrderService.deleteExpense(id);
      if (response.success) {
        showNotification('Charge supprimée');
        refreshAll();
      }
    } catch (error) {
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  // ── Render ─────────────────────────────────────
  return (
    <div className="space-y-8 pb-8">
      {/* Notification toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 ${
            notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#111f35] to-[#1a2d4a] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Statistiques & Charges</h1>
            <p className="mt-2 text-[#e8ddca] opacity-90">
              Métriques financières, charges et analyses de revenus
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshAll}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Actualiser"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#111f35] rounded-xl hover:bg-[#fdf9ee] transition-colors font-semibold"
            >
              <PlusIcon className="w-5 h-5" />
              Nouvelle charge
            </button>
          </div>
        </div>
      </div>

      {/* Date range filter */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <CalendarDaysIcon className="w-5 h-5 text-[#5d1115]" />
          <span className="text-sm font-semibold text-[#111f35]">Filtrer par période :</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none text-sm"
          />
          <span className="text-gray-400">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none text-sm"
          />
          {(startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-[#5d1115] hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Financial Metrics */}
      <FinancialMetrics metrics={metrics} loading={loadingMetrics} />

      {/* Revenue by Source breakdown */}
      {metrics?.revenueBySource && metrics.revenueBySource.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] p-6">
          <h3 className="text-lg font-bold text-[#111f35] mb-4">Revenus par source</h3>
          <div className="space-y-3">
            {metrics.revenueBySource.map((item) => {
              const maxVal = metrics.revenueBySource[0]?.total || 1;
              const pct = (item.total / maxVal) * 100;
              return (
                <div key={item._id} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#111f35] w-32 shrink-0">{item._id}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5d1115] to-[#8d1619] rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    >
                      <span className="text-xs text-white font-semibold">{item.count}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#111f35] w-28 text-right">
                    {new Intl.NumberFormat('fr-TN', {
                      style: 'currency',
                      currency: 'TND',
                      minimumFractionDigits: 3,
                    }).format(item.total)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expenses by Category breakdown */}
      {metrics?.expensesByCategory && metrics.expensesByCategory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8ddca] p-6">
          <h3 className="text-lg font-bold text-[#111f35] mb-4">Charges par catégorie</h3>
          <div className="space-y-3">
            {metrics.expensesByCategory.map((item) => {
              const maxVal = metrics.expensesByCategory[0]?.total || 1;
              const pct = (item.total / maxVal) * 100;
              return (
                <div key={item._id} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#111f35] w-32 shrink-0">{item._id}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    >
                      <span className="text-xs text-white font-semibold">{item.count}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-red-600 w-28 text-right">
                    {new Intl.NumberFormat('fr-TN', {
                      style: 'currency',
                      currency: 'TND',
                      minimumFractionDigits: 3,
                    }).format(item.total)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <ExpensesList
        expenses={expenses}
        onEdit={(expense) => setEditingExpense(expense)}
        onDelete={handleDeleteExpense}
        loading={loadingExpenses}
      />

      {/* Website Orders Section */}
      <WebsiteOrdersList orders={websiteOrders} loading={loadingWebOrders} />

      {/* ── Modals ──────────────────────────────── */}
      {showExpenseForm && (
        <ExpenseForm
          expense={null}
          onSubmit={handleCreateExpense}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleUpdateExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
};

export default DashboardFinancials;
