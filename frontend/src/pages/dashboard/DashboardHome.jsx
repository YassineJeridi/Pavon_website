// frontend/src/pages/dashboard/DashboardHome.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  SparklesIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

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

  useEffect(() => {
    document.title = 'Tableau de bord - Pavon Admin';
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

    // Group orders by appropriate interval
    const interval = days > 90 ? 30 : days > 30 ? 7 : 1; // Monthly, weekly, or daily
    const points = Math.ceil(days / interval);

    for (let i = points - 1; i >= 0; i--) {
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() - (i * interval));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - interval + 1);
      startDate.setHours(0, 0, 0, 0);

      // Calculate revenue for this period
      const periodRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startDate && orderDate <= endDate;
        })
        .reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);

      data.push({
        label: getDateLabel(endDate, days),
        revenue: periodRevenue,
        date: endDate,
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

  // Helper function to create smooth curve path
  const createSmoothPath = (data) => {
    if (data.length === 0) return '';
    if (data.length === 1) {
      const x = 0;
      const y = 100 - (data[0].revenue / maxRevenue) * 100;
      return `M ${x},${y}`;
    }

    let path = '';
    
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (data[i].revenue / maxRevenue) * 100;
      
      if (i === 0) {
        path += `M ${x},${y}`;
      } else {
        // Calculate control points for smooth curve
        const prevX = ((i - 1) / (data.length - 1)) * 100;
        const prevY = 100 - (data[i - 1].revenue / maxRevenue) * 100;
        
        const cp1x = prevX + (x - prevX) / 3;
        const cp1y = prevY;
        const cp2x = prevX + (2 * (x - prevX)) / 3;
        const cp2y = y;
        
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
      }
    }
    
    return path;
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
      <div className="bg-gradient-to-r from-[#5d1115] to-[#8d1619] rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold">Tableau de bord</h1>
        <p className="mt-2 text-[#fdf9ee] opacity-90">
          Bienvenue dans votre espace d'administration Pavon
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#5d1115] to-[#8d1619] p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#fdf9ee] opacity-80 text-sm font-medium">Ventes totales</p>
              <p className="text-3xl font-bold mt-2">{stats.totalSales} TND</p>
              <p className="text-xs text-[#e8ddca] mt-1">+{stats.salesChange}% ce mois</p>
            </div>
            <CurrencyDollarIcon className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#e8ddca]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#111f35] opacity-70 text-sm font-medium">Commandes</p>
              <p className="text-3xl font-bold text-[#111f35] mt-2">{stats.totalOrders}</p>
              <p className="text-xs text-[#5d1115] mt-1">+{stats.ordersChange}% ce mois</p>
            </div>
            <ShoppingBagIcon className="w-12 h-12 text-[#5d1115] opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#e8ddca]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#111f35] opacity-70 text-sm font-medium">Panier moyen</p>
              <p className="text-3xl font-bold text-[#111f35] mt-2">{stats.averageOrderValue} TND</p>
              <p className="text-xs text-[#5d1115] mt-1">+{stats.averageChange}% ce mois</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-[#5d1115] opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#111f35] to-[#1a2d4a] p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#fdf9ee] opacity-80 text-sm font-medium">Clients actifs</p>
              <p className="text-3xl font-bold mt-2">{stats.newCustomers}</p>
              <p className="text-xs text-[#e8ddca] mt-1">+{stats.customersChange}% ce mois</p>
            </div>
            <TruckIcon className="w-12 h-12 opacity-20" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#e8ddca]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111f35]">
            Évolution du chiffre d'affaires
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePeriodChange(7)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartPeriod === 7
                  ? 'bg-[#5d1115] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7 jours
            </button>
            <button
              onClick={() => handlePeriodChange(30)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartPeriod === 30
                  ? 'bg-[#5d1115] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30 jours
            </button>
            <button
              onClick={() => handlePeriodChange(90)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartPeriod === 90
                  ? 'bg-[#5d1115] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              90 jours
            </button>
            <button
              onClick={() => handlePeriodChange(365)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartPeriod === 365
                  ? 'bg-[#5d1115] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              1 an
            </button>
          </div>
        </div>

        <div className="h-80 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-12 w-16 flex flex-col justify-between text-xs text-gray-500">
            {[...Array(6)].map((_, i) => {
              const value = (maxRevenue * (5 - i)) / 5;
              return (
                <div key={i} className="text-right pr-2">
                  {value > 0 ? `${Math.round(value)} TND` : ''}
                </div>
              );
            })}
          </div>

          {/* Chart area */}
          <div className="ml-16 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-t border-gray-200" />
              ))}
            </div>

            {/* Line chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {/* Area gradient */}
              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5d1115" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#5d1115" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              {revenueData.length > 0 && (
                <path
                  d={`${createSmoothPath(revenueData)} L 100,100 L 0,100 Z`}
                  fill="url(#revenueGradient)"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Line */}
              {revenueData.length > 0 && (
                <path
                  d={createSmoothPath(revenueData)}
                  fill="none"
                  stroke="#5d1115"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  className="drop-shadow-md"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {revenueData.map((d, i) => {
                const x = (i / (revenueData.length - 1)) * 100;
                const y = 100 - (d.revenue / maxRevenue) * 100;
                return (
                  <circle
                    key={i}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="#5d1115"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                  />
                );
              })}
            </svg>

            {/* Data point tooltips */}
            <div className="absolute inset-0">
              {revenueData.map((d, i) => {
                const x = (i / (revenueData.length - 1)) * 100;
                const y = 100 - (d.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={i}
                    className="absolute group"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="w-8 h-8 cursor-pointer" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#111f35] text-white px-3 py-2 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      <div className="font-bold">{d.revenue.toFixed(2)} TND</div>
                      <div className="text-[#e8ddca] text-xs">{d.label}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#111f35]"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-4">
              {revenueData.map((day, index) => (
                <div
                  key={index}
                  className="text-xs text-[#111f35] font-medium text-center"
                  style={{ width: `${100 / revenueData.length}%` }}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>
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
    </div>
  );
};

export default DashboardHome;
