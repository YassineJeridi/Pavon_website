// frontend/src/pages/dashboard/DashboardExternalOrders.jsx
// External orders page — order entry, orders table, and recurring clients

import { useState, useEffect, useCallback } from 'react';
import externalOrderService from '../../services/externalOrderService';
import OrdersTable from '../../components/dashboard/externalOrders/OrdersTable';
import ExternalOrderForm from '../../components/dashboard/externalOrders/ExternalOrderForm';
import RecurringClients from '../../components/dashboard/externalOrders/RecurringClients';
import {
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const DashboardExternalOrders = () => {
  // ── State ──────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientOrders, setClientOrders] = useState([]);

  // Loading states
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Table state
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Notification
  const [notification, setNotification] = useState(null);

  // ── Page title ─────────────────────────────────
  useEffect(() => {
    document.title = 'Commandes Externes - Pavone Admin';
  }, []);

  // ── Notifications ──────────────────────────────
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── Fetch functions ────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const response = await externalOrderService.getAllOrders({
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder,
        ...filters,
      });
      if (response.success) {
        setOrders(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Erreur lors du chargement des commandes', 'error');
    } finally {
      setLoadingOrders(false);
    }
  }, [currentPage, sortBy, sortOrder, filters]);

  const fetchClients = useCallback(async () => {
    try {
      setLoadingClients(true);
      const response = await externalOrderService.getRecurringClients();
      if (response.success) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  const fetchClientHistory = async (name) => {
    try {
      setLoadingHistory(true);
      const response = await externalOrderService.getClientOrders(name);
      if (response.success) {
        setClientOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching client history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ── Effects ────────────────────────────────────
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const refreshAll = () => {
    fetchOrders();
    fetchClients();
  };

  // ── Order handlers ─────────────────────────────
  const handleCreateOrder = async (data) => {
    try {
      const response = await externalOrderService.createOrder(data);
      if (response.success) {
        showNotification('Commande créée avec succès');
        setShowOrderForm(false);
        refreshAll();
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de la création', 'error');
    }
  };

  const handleUpdateOrder = async (data) => {
    try {
      const response = await externalOrderService.updateOrder(editingOrder._id, data);
      if (response.success) {
        showNotification('Commande mise à jour avec succès');
        setEditingOrder(null);
        refreshAll();
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    try {
      const response = await externalOrderService.deleteOrder(id);
      if (response.success) {
        showNotification('Commande supprimée');
        refreshAll();
      }
    } catch (error) {
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  // ── Filter / Sort / Page handlers ──────────────
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <div className="bg-gradient-to-r from-[#5d1115] to-[#8d1619] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Commandes Externes</h1>
            <p className="mt-2 text-[#fdf9ee] opacity-90">
              Gérez vos commandes Facebook, Instagram, WhatsApp et autres sources
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
              onClick={() => setShowOrderForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#5d1115] rounded-xl hover:bg-[#fdf9ee] transition-colors font-semibold"
            >
              <PlusIcon className="w-5 h-5" />
              Nouvelle commande
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        pagination={pagination}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onEdit={(order) => setEditingOrder(order)}
        onDelete={handleDeleteOrder}
        onPageChange={handlePageChange}
        loading={loadingOrders}
      />

      {/* Recurring Clients */}
      <RecurringClients
        clients={clients}
        onViewHistory={fetchClientHistory}
        clientOrders={clientOrders}
        loadingHistory={loadingHistory}
        loading={loadingClients}
      />

      {/* ── Modals ──────────────────────────────── */}
      {showOrderForm && (
        <ExternalOrderForm
          order={null}
          onSubmit={handleCreateOrder}
          onClose={() => setShowOrderForm(false)}
        />
      )}
      {editingOrder && (
        <ExternalOrderForm
          order={editingOrder}
          onSubmit={handleUpdateOrder}
          onClose={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
};

export default DashboardExternalOrders;
