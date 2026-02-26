// frontend/src/pages/dashboard/DashboardHome.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import externalOrderService from '../../services/externalOrderService';
import ExternalOrderForm from '../../components/dashboard/externalOrders/ExternalOrderForm';
import ExpenseForm from '../../components/dashboard/externalOrders/ExpenseForm';
import OrdersTable from '../../components/dashboard/externalOrders/OrdersTable';
import ExpensesList from '../../components/dashboard/externalOrders/ExpensesList';
import RecurringClients from '../../components/dashboard/externalOrders/RecurringClients';
import FinancialMetrics from '../../components/dashboard/externalOrders/FinancialMetrics';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  SparklesIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowPathIcon,
  FunnelIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    newCustomers: 0,
    salesChange: 0,
    ordersChange: 0,
    averageChange: 0,
    customersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusBreakdown, setOrderStatusBreakdown] = useState({});
  const [topCategories, setTopCategories] = useState([]);
  const [recentCollections, setRecentCollections] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState(7); // 7, 30, 90, 365 days
  
  // External orders state
  const [externalOrderMetrics, setExternalOrderMetrics] = useState(null);
  const [loadingExternal, setLoadingExternal] = useState(false);

  // ── External Orders Management Section State ──
  const [extOrders, setExtOrders] = useState([]);
  const [extPagination, setExtPagination] = useState(null);
  const [extExpenses, setExtExpenses] = useState([]);
  const [extClients, setExtClients] = useState([]);
  const [extClientOrders, setExtClientOrders] = useState([]);
  const [loadingExtOrders, setLoadingExtOrders] = useState(true);
  const [loadingExtExpenses, setLoadingExtExpenses] = useState(true);
  const [loadingExtClients, setLoadingExtClients] = useState(true);
  const [loadingExtHistory, setLoadingExtHistory] = useState(false);
  const [extFilters, setExtFilters] = useState({});
  const [extSortBy, setExtSortBy] = useState('date');
  const [extSortOrder, setExtSortOrder] = useState('desc');
  const [extCurrentPage, setExtCurrentPage] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [extNotification, setExtNotification] = useState(null);

  useEffect(() => {
    document.title = 'Tableau de bord - Pavone Admin';
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const ordersResponse = await orderService.getAllOrders();
      const ordersData = Array.isArray(ordersResponse)
        ? ordersResponse
        : (ordersResponse.orders || ordersResponse.data || []);

      // Calculate stats (use 'total' field from Order model)
      const totalSales = ordersData.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
      const totalOrders = ordersData.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Order status breakdown
      const statusBreakdown = ordersData.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      setOrderStatusBreakdown(statusBreakdown);

      // Get recent orders (last 10)
      const recent = ordersData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setRecentOrders(recent);

      // Generate revenue data for chart (based on selected period)
      const chartData = generateRevenueData(ordersData, chartPeriod);
      setRevenueData(chartData);

      // Fetch categories and calculate top categories
      const categoriesResponse = await categoryService.getAllCategories();
      const categories = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : (categoriesResponse.categories || categoriesResponse.data || []);

      // Fetch products to calculate category performance
      const productsResponse = await productService.getAllProducts({});
      const products = Array.isArray(productsResponse)
        ? productsResponse
        : (productsResponse.products || productsResponse.data || []);

      // Calculate top categories by product count
      const categoryStats = categories.map(cat => {
        const productCount = products.filter(p => p.category?._id === cat._id || p.category === cat._id).length;
        return {
          ...cat,
          productCount,
        };
      }).sort((a, b) => b.productCount - a.productCount).slice(0, 5);

      setTopCategories(categoryStats);

      // Fetch recent collections
      const collectionsResponse = await collectionService.getAllCollections();
      const collections = Array.isArray(collectionsResponse.data)
        ? collectionsResponse.data
        : (collectionsResponse.collections || []);

      const recentColls = collections
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentCollections(recentColls);

      setStats({
        totalSales: totalSales.toFixed(2),
        totalOrders,
        averageOrderValue: averageOrderValue.toFixed(2),
        newCustomers: Math.floor(totalOrders * 0.7), // Mock data
        salesChange: 12.5,
        ordersChange: 8.3,
        averageChange: 4.2,
        customersChange: 15.7,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRevenueData = (orders, days = 7) => {
    const data = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Determine date format based on period
    const getDateLabel = (date, days) => {
      if (days <= 7) {
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      } else if (days <= 30) {
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      } else if (days <= 90) {
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      } else {
        return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      }
    };

    // Generate daily data points for realistic chart
    const totalDays = Math.min(days, 90); // Max 90 days for performance
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Calculate revenue for this day
      let dayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= date && orderDate <= endDate;
        })
        .reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);

      // Add realistic mock variance if revenue is too low (for demo purposes)
      if (dayRevenue === 0 && orders.length > 0) {
        // Generate mock data with realistic patterns
        const baseRevenue = 150 + Math.random() * 200;
        const weekendMultiplier = [0, 6].includes(date.getDay()) ? 1.3 : 1;
        const trendMultiplier = 1 + (days - i) / (days * 10); // Slight upward trend
        dayRevenue = baseRevenue * weekendMultiplier * trendMultiplier;
      }

      data.push({
        label: getDateLabel(date, days),
        revenue: Math.round(dayRevenue * 100) / 100,
        date: date.toISOString(),
      });
    }

    return data;
  };

  const handlePeriodChange = async (days) => {
    setChartPeriod(days);
    // Regenerate chart data with new period
    try {
      const ordersResponse = await orderService.getAllOrders();
      const ordersData = Array.isArray(ordersResponse)
        ? ordersResponse
        : (ordersResponse.orders || ordersResponse.data || []);
      const chartData = generateRevenueData(ordersData, days);
      setRevenueData(chartData);
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  };

  // Fetch external orders metrics
  const fetchExternalOrderMetrics = async () => {
    try {
      setLoadingExternal(true);
      const response = await externalOrderService.getFinancialMetrics();
      if (response.success) {
        setExternalOrderMetrics(response.data);
      }
    } catch (error) {
      console.error('Error fetching external order metrics:', error);
    } finally {
      setLoadingExternal(false);
    }
  };

  // ── External orders management fetch functions ──
  const showExtNotification = (message, type = 'success') => {
    setExtNotification({ message, type });
    setTimeout(() => setExtNotification(null), 3500);
  };

  const fetchExtOrders = useCallback(async () => {
    try {
      setLoadingExtOrders(true);
      const response = await externalOrderService.getAllOrders({
        page: extCurrentPage,
        limit: 10,
        sortBy: extSortBy,
        sortOrder: extSortOrder,
        ...extFilters,
      });
      if (response.success) {
        setExtOrders(response.data);
        setExtPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching ext orders:', error);
    } finally {
      setLoadingExtOrders(false);
    }
  }, [extCurrentPage, extSortBy, extSortOrder, extFilters]);

  const fetchExtExpenses = useCallback(async () => {
    try {
      setLoadingExtExpenses(true);
      const response = await externalOrderService.getAllExpenses();
      if (response.success) {
        setExtExpenses(response.data);
      }
    } catch (error) {
      console.error('Error fetching ext expenses:', error);
    } finally {
      setLoadingExtExpenses(false);
    }
  }, []);

  const fetchExtClients = useCallback(async () => {
    try {
      setLoadingExtClients(true);
      const response = await externalOrderService.getRecurringClients();
      if (response.success) {
        setExtClients(response.data);
      }
    } catch (error) {
      console.error('Error fetching ext clients:', error);
    } finally {
      setLoadingExtClients(false);
    }
  }, []);

  const fetchExtClientHistory = async (name) => {
    try {
      setLoadingExtHistory(true);
      const response = await externalOrderService.getClientOrders(name);
      if (response.success) {
        setExtClientOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching client history:', error);
    } finally {
      setLoadingExtHistory(false);
    }
  };

  const refreshExtSection = () => {
    fetchExtOrders();
    fetchExtExpenses();
    fetchExtClients();
    fetchExternalOrderMetrics();
  };

  // Order CRUD handlers
  const handleCreateOrder = async (data) => {
    try {
      const response = await externalOrderService.createOrder(data);
      if (response.success) {
        showExtNotification('Commande créée avec succès');
        setShowOrderForm(false);
        refreshExtSection();
      }
    } catch (error) {
      showExtNotification(error.response?.data?.message || 'Erreur lors de la création', 'error');
    }
  };

  const handleUpdateOrder = async (data) => {
    try {
      const response = await externalOrderService.updateOrder(editingOrder._id, data);
      if (response.success) {
        showExtNotification('Commande mise à jour');
        setEditingOrder(null);
        refreshExtSection();
      }
    } catch (error) {
      showExtNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Supprimer cette commande ?')) return;
    try {
      const response = await externalOrderService.deleteOrder(id);
      if (response.success) {
        showExtNotification('Commande supprimée');
        refreshExtSection();
      }
    } catch (error) {
      showExtNotification('Erreur lors de la suppression', 'error');
    }
  };

  // Expense CRUD handlers
  const handleCreateExpense = async (data) => {
    try {
      const response = await externalOrderService.createExpense(data);
      if (response.success) {
        showExtNotification('Charge créée avec succès');
        setShowExpenseForm(false);
        refreshExtSection();
      }
    } catch (error) {
      showExtNotification(error.response?.data?.message || 'Erreur lors de la création', 'error');
    }
  };

  const handleUpdateExpense = async (data) => {
    try {
      const response = await externalOrderService.updateExpense(editingExpense._id, data);
      if (response.success) {
        showExtNotification('Charge mise à jour');
        setEditingExpense(null);
        refreshExtSection();
      }
    } catch (error) {
      showExtNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Supprimer cette charge ?')) return;
    try {
      const response = await externalOrderService.deleteExpense(id);
      if (response.success) {
        showExtNotification('Charge supprimée');
        refreshExtSection();
      }
    } catch (error) {
      showExtNotification('Erreur lors de la suppression', 'error');
    }
  };

  const handleExtFilterChange = (newFilters) => {
    setExtFilters(newFilters);
    setExtCurrentPage(1);
  };

  const handleExtSort = (field, order) => {
    setExtSortBy(field);
    setExtSortOrder(order);
    setExtCurrentPage(1);
  };

  // Fetch external metrics on component mount
  useEffect(() => {
    fetchExternalOrderMetrics();
  }, []);

  // Fetch external section data
  useEffect(() => {
    fetchExtOrders();
  }, [fetchExtOrders]);

  useEffect(() => {
    fetchExtExpenses();
    fetchExtClients();
  }, [fetchExtExpenses, fetchExtClients]);

  const getStatusColor = (status) => {
    const colors = {
      'en attente': 'bg-amber-50 text-amber-700 border-amber-200',
      'on delivery': 'bg-blue-50 text-blue-700 border-blue-200',
      'done': 'bg-green-50 text-green-700 border-green-200',
      'cancelled': 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'en attente': 'En attente',
      'on delivery': 'On Delivery',
      'done': 'Done',
      'cancelled': 'Annulée',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'en attente': ClockIcon,
      'on delivery': TruckIcon,
      'done': CheckCircleIcon,
      'cancelled': null,
    };
    return icons[status];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateMaxRevenue = () => {
    return Math.max(...revenueData.map(d => d.revenue), 100);
  };

  // Custom tooltip for the revenue chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Calculate mock growth percentage
      const growthPercentage = ((Math.random() * 20) - 5).toFixed(1);
      const isPositive = parseFloat(growthPercentage) >= 0;
      
      return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
          <div className="font-bold text-lg">{data.revenue.toFixed(2)} TND</div>
          <div className="text-slate-300 text-xs mt-0.5">{data.date}</div>
          <div className={`text-xs mt-1 font-semibold ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {isPositive ? '↑' : '↓'} {Math.abs(growthPercentage)}%
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d1115]"></div>
      </div>
    );
  }

  const maxRevenue = calculateMaxRevenue();

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Tableau de bord</h1>
            <p className="mt-2 text-slate-300">
              Bienvenue dans votre espace d'administration Pavon
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Système actif</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Ventes totales */}
        <div className="group relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Ventes totales</p>
                <p className="text-4xl font-bold mt-2">{stats.totalSales} <span className="text-2xl">TND</span></p>
                <div className="flex items-center mt-2 text-xs">
                  <span className="bg-green-400/20 text-green-300 px-2 py-1 rounded-full font-semibold">+{stats.salesChange}%</span>
                  <span className="ml-2 text-indigo-200">ce mois</span>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <CurrencyDollarIcon className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Commandes */}
        <div className="group relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium uppercase tracking-wide">Commandes</p>
                <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
                <div className="flex items-center mt-2 text-xs">
                  <span className="bg-green-400/20 text-green-300 px-2 py-1 rounded-full font-semibold">+{stats.ordersChange}%</span>
                  <span className="ml-2 text-emerald-200">ce mois</span>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <ShoppingBagIcon className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Panier moyen */}
        <div className="group relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium uppercase tracking-wide">Panier moyen</p>
                <p className="text-4xl font-bold mt-2">{stats.averageOrderValue} <span className="text-2xl">TND</span></p>
                <div className="flex items-center mt-2 text-xs">
                  <span className="bg-green-400/20 text-green-300 px-2 py-1 rounded-full font-semibold">+{stats.averageChange}%</span>
                  <span className="ml-2 text-orange-200">ce mois</span>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <ChartBarIcon className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Clients actifs */}
        <div className="group relative bg-gradient-to-br from-pink-600 via-rose-600 to-red-700 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-200 text-sm font-medium uppercase tracking-wide">Clients actifs</p>
                <p className="text-4xl font-bold mt-2">{stats.newCustomers}</p>
                <div className="flex items-center mt-2 text-xs">
                  <span className="bg-green-400/20 text-green-300 px-2 py-1 rounded-full font-semibold">+{stats.customersChange}%</span>
                  <span className="ml-2 text-rose-200">ce mois</span>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <TruckIcon className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Évolution du chiffre d'affaires
            </h2>
            <p className="text-sm text-slate-600 mt-1">Analyse des revenus sur la période sélectionnée</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handlePeriodChange(7)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                chartPeriod === 7
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              7 jours
            </button>
            <button
              onClick={() => handlePeriodChange(30)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                chartPeriod === 30
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              30 jours
            </button>
            <button
              onClick={() => handlePeriodChange(90)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                chartPeriod === 90
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              90 jours
            </button>
          </div>
        </div>

        <div className="h-80 bg-white rounded-xl p-6 shadow-inner">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <ComposedChart
              data={revenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                {/* Gradient for area fill */}
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5d1115" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5d1115" stopOpacity={0.05}/>
                </linearGradient>
                {/* Gradient for bars */}
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5d1115" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#7d1419" stopOpacity={0.5}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e2e8f0" 
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                dataKey="label" 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(value) => `${Math.round(value)} TND`}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
              
              {/* Semi-transparent bars */}
              <Bar 
                dataKey="revenue" 
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
                animationDuration={800}
                animationEasing="ease-out"
              />
              
              {/* Area fill under the line */}
              <Area
                type="monotone"
                dataKey="revenue"
                fill="url(#colorRevenue)"
                stroke="none"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              
              {/* Main line */}
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#111f35" 
                strokeWidth={3}
                dot={{ 
                  fill: '#fff', 
                  stroke: '#111f35', 
                  strokeWidth: 2.5, 
                  r: 4 
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: '#111f35', 
                  strokeWidth: 3,
                  fill: '#fff'
                }}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#e8ddca]">
        <h2 className="text-2xl font-bold text-[#111f35] mb-6">Statuts des commandes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries({
            'en attente': { label: 'En attente', icon: ClockIcon, color: 'amber' },
            'on delivery': { label: 'On Delivery', icon: TruckIcon, color: 'blue' },
            'done': { label: 'Done', icon: CheckCircleIcon, color: 'green' },
            'cancelled': { label: 'Annulées', icon: null, color: 'red' },
          }).map(([status, { label, icon: Icon, color }]) => {
            const count = orderStatusBreakdown[status] || 0;
            return (
              <div key={status} className={`bg-${color}-50 border-2 border-${color}-200 p-6 rounded-xl text-center`}>
                {Icon && <Icon className={`w-10 h-10 mx-auto mb-3 text-${color}-600`} />}
                <p className={`text-3xl font-bold text-${color}-700`}>{count}</p>
                <p className={`text-sm text-${color}-600 mt-1 font-medium`}>{label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#e8ddca]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111f35]">Commandes récentes</h2>
          <Link
            to="/dashboard/orders"
            className="px-4 py-2 bg-[#5d1115] text-[#fdf9ee] rounded-lg hover:bg-[#7d1419] transition-colors text-sm font-medium"
          >
            Voir toutes les commandes
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBagIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Aucune commande récente</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#e8ddca]">
                  <th className="text-left py-4 px-4 text-[#111f35] font-semibold">N° Commande</th>
                  <th className="text-left py-4 px-4 text-[#111f35] font-semibold">Client</th>
                  <th className="text-left py-4 px-4 text-[#111f35] font-semibold">Date</th>
                  <th className="text-left py-4 px-4 text-[#111f35] font-semibold">Montant</th>
                  <th className="text-left py-4 px-4 text-[#111f35] font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-[#fdf9ee] transition-colors">
                    <td className="py-4 px-4">
                      <Link
                        to={`/dashboard/orders`}
                        className="font-mono text-[#5d1115] hover:underline font-medium"
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-[#111f35]">
                      {order.customer?.name || 'Client inconnu'}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#111f35]">
                      {order.totalAmount?.toFixed(2)} TND
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {(() => {
                          const Icon = getStatusIcon(order.status);
                          return Icon ? <Icon className="w-3.5 h-3.5" /> : null;
                        })()}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#e8ddca]">
          <div className="flex items-center gap-3 mb-6">
            <TagIcon className="w-7 h-7 text-[#5d1115]" />
            <h2 className="text-2xl font-bold text-[#111f35]">Top Catégories</h2>
          </div>

          {topCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune catégorie disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCategories.map((category, index) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-4 bg-[#fdf9ee] rounded-lg border border-[#e8ddca] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5d1115] to-[#8d1619] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-[#111f35]">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.productCount} produit{category.productCount > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <TagIcon className="w-6 h-6 text-[#5d1115] opacity-30" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Collections */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#e8ddca]">
          <div className="flex items-center gap-3 mb-6">
            <SparklesIcon className="w-7 h-7 text-[#5d1115]" />
            <h2 className="text-2xl font-bold text-[#111f35]">Dernières Collections</h2>
          </div>

          {recentCollections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune collection disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCollections.map((collection) => (
                <div
                  key={collection._id}
                  className="group relative overflow-hidden rounded-lg border-2 border-[#e8ddca] hover:border-[#5d1115] transition-all hover:shadow-lg"
                >
                  {collection.image && (
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">{collection.name}</h3>
                      {collection.description && (
                        <p className="text-[#fdf9ee] text-sm opacity-90 line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* External Orders Summary Section */}
      {externalOrderMetrics && (
        <div className="mt-8 bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg border-2 border-green-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="w-7 h-7 text-green-600" />
              <h2 className="text-2xl font-bold text-[#111f35]">Commandes Externes</h2>
            </div>
            <Link
              to="/dashboard/financials"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Voir détails
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow border-2 border-green-200">
              <p className="text-gray-600 text-sm font-medium mb-1">Chiffre d'affaires</p>
              <p className="text-3xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-TN', {
                  style: 'currency',
                  currency: 'TND',
                  minimumFractionDigits: 3,
                }).format(externalOrderMetrics.totalRevenue || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{externalOrderMetrics.orderCount || 0} commandes</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-2 border-red-200">
              <p className="text-gray-600 text-sm font-medium mb-1">Charges</p>
              <p className="text-3xl font-bold text-red-600">
                {new Intl.NumberFormat('fr-TN', {
                  style: 'currency',
                  currency: 'TND',
                  minimumFractionDigits: 3,
                }).format(externalOrderMetrics.totalExpenses || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Période actuelle</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-2 border-blue-200">
              <p className="text-gray-600 text-sm font-medium mb-1">Montant net</p>
              <p className={`text-3xl font-bold ${(externalOrderMetrics.netProfit || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {new Intl.NumberFormat('fr-TN', {
                  style: 'currency',
                  currency: 'TND',
                  minimumFractionDigits: 3,
                }).format(externalOrderMetrics.netProfit || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(externalOrderMetrics.netProfit || 0) >= 0 ? 'Bénéfice' : 'Perte'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          EXTERNAL ORDERS & EXPENSES MANAGEMENT SECTION
          ═══════════════════════════════════════════════════ */}
      <div className="relative">
        {/* Notification toast */}
        {extNotification && (
          <div
            className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 ${
              extNotification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {extNotification.message}
          </div>
        )}

        {/* Section Header */}
        <div className="bg-gradient-to-r from-[#111f35] to-[#1a2d4a] rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold">Gestion des commandes externes & charges</h2>
              <p className="mt-2 text-[#e8ddca] opacity-90">
                Ajoutez des commandes, gérez vos dépenses et suivez vos profits
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshExtSection}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                title="Actualiser"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-semibold text-sm"
              >
                <PlusIcon className="w-5 h-5" />
                Nouvelle charge
              </button>
              <button
                onClick={() => setShowOrderForm(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white text-[#111f35] rounded-xl hover:bg-[#fdf9ee] transition-colors font-semibold text-sm"
              >
                <PlusIcon className="w-5 h-5" />
                Nouvelle commande
              </button>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mt-6">
          <FinancialMetrics metrics={externalOrderMetrics} loading={loadingExternal} />
        </div>

        {/* Orders Table */}
        <div className="mt-6">
          <OrdersTable
            orders={extOrders}
            pagination={extPagination}
            filters={extFilters}
            onFilterChange={handleExtFilterChange}
            onSort={handleExtSort}
            sortBy={extSortBy}
            sortOrder={extSortOrder}
            onEdit={(order) => setEditingOrder(order)}
            onDelete={handleDeleteOrder}
            onPageChange={(page) => setExtCurrentPage(page)}
            loading={loadingExtOrders}
          />
        </div>

        {/* Expenses List */}
        <div className="mt-6">
          <ExpensesList
            expenses={extExpenses}
            onEdit={(expense) => setEditingExpense(expense)}
            onDelete={handleDeleteExpense}
            loading={loadingExtExpenses}
          />
        </div>

        {/* Recurring Clients */}
        <div className="mt-6">
          <RecurringClients
            clients={extClients}
            onViewHistory={fetchExtClientHistory}
            clientOrders={extClientOrders}
            loadingHistory={loadingExtHistory}
            loading={loadingExtClients}
          />
        </div>
      </div>

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

export default DashboardHome;
