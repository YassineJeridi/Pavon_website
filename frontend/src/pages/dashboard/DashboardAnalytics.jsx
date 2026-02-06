// frontend/src/pages/dashboard/DashboardAnalytics.jsx

import { useState, useEffect } from 'react';
import  orderService  from '../../services/orderService';
import  productService  from '../../services/productService';
import SalesStats from '../../components/dashboard/analytics/SalesStats';
import RevenueChart from '../../components/dashboard/analytics/RevenueChart';

const DashboardAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Analytiques - Élégance Admin';
    fetchAnalytics();
  }, [timeRange]);

const fetchAnalytics = async () => {
  try {
    setLoading(true);
    const data = await orderService.getAllOrders();
    console.log('📦 Analytics Orders API response:', data);
    
    // ✅ FIXED: Handle multiple response formats
    let ordersData = [];
    if (Array.isArray(data)) {
      ordersData = data;
    } else if (data.orders && Array.isArray(data.orders)) {
      ordersData = data.orders;
    } else if (data.data && Array.isArray(data.data)) {
      ordersData = data.data;
    }
    
    // Calculate comprehensive stats
    const totalSales = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = ordersData.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Generate revenue chart data based on time range
    const chartData = generateRevenueData(ordersData, timeRange);
    setRevenueData(chartData);

    setStats({
      totalSales: totalSales.toFixed(2),
      totalOrders,
      averageOrderValue: averageOrderValue.toFixed(2),
      newCustomers: Math.floor(totalOrders * 0.7),
      salesChange: 12.5,
      ordersChange: 8.3,
      averageChange: 4.2,
      customersChange: 15.7,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // ✅ Set default stats on error
    setStats({
      totalSales: '0.00',
      totalOrders: 0,
      averageOrderValue: '0.00',
      newCustomers: 0,
      salesChange: 0,
      ordersChange: 0,
      averageChange: 0,
      customersChange: 0,
    });
  } finally {
    setLoading(false);
  }
};


  const generateRevenueData = (orders, range) => {
    let labels = [];
    let days = 7;

    switch (range) {
      case '7days':
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        days = 7;
        break;
      case '30days':
        labels = Array.from({ length: 30 }, (_, i) => `J${i + 1}`);
        days = 30;
        break;
      case '3months':
        labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        days = 12;
        break;
      default:
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        days = 7;
    }

    const data = labels.map((label) => {
      const revenue = Math.random() * 5000 + 1000;
      return {
        label,
        revenue,
      };
    });

    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytiques</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble des performances de votre boutique</p>
      </div>

      {stats && <SalesStats stats={stats} />}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Évolution des revenus</h2>
            <p className="text-sm text-gray-600 mt-1">Analyse des ventes par période</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="3months">3 derniers mois</option>
          </select>
        </div>
        <RevenueChart data={revenueData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Catégories</h3>
          <div className="space-y-4">
            {['Hommes', 'Femmes', 'Accessoires'].map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{cat}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.floor(Math.random() * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Statuts des commandes</h3>
          <div className="space-y-4">
            {[
              { status: 'En attente', count: 12, color: 'bg-yellow-500' },
              { status: 'En cours', count: 8, color: 'bg-blue-500' },
              { status: 'Expédiées', count: 25, color: 'bg-purple-500' },
              { status: 'Livrées', count: 145, color: 'bg-green-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-gray-700">{item.status}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
