// backend/controllers/dashboardController.js

const Order = require('../models/Order');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const Admin = require('../models/Admin');

// @desc    Get dashboard overview statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getOverviewStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total orders
    const totalOrders = await Order.countDocuments();
    const monthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Total revenue
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const monthRevenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const monthRevenue = monthRevenueData[0]?.total || 0;

    const lastMonthRevenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const lastMonthRevenue = lastMonthRevenueData[0]?.total || 0;

    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({
      isActive: true,
      stock: { $lte: 10, $gt: 0 },
    });
    const outOfStockProducts = await Product.countDocuments({
      isActive: true,
      stock: 0,
    });

    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: 'en attente' });

    // Unread contacts
    const unreadContacts = await Contact.countDocuments({ read: false });

    // Calculate growth percentages
    const orderGrowth =
      lastMonthOrders > 0
        ? ((monthOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0;

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        orders: {
          total: totalOrders,
          thisMonth: monthOrders,
          lastMonth: lastMonthOrders,
          growth: orderGrowth.toFixed(2),
          pending: pendingOrders,
        },
        revenue: {
          total: totalRevenue,
          thisMonth: monthRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth.toFixed(2),
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },
        contacts: {
          unread: unreadContacts,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/dashboard/revenue
// @access  Private/Admin
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { range = '7days' } = req.query;

    let startDate;
    const endDate = new Date();

    switch (range) {
      case '7days':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses de revenus',
      error: error.message,
    });
  }
};

// @desc    Get sales by category
// @route   GET /api/dashboard/sales-by-category
// @access  Private/Admin
exports.getSalesByCategory = async (req, res) => {
  try {
    const { range = '30days' } = req.query;

    let startDate;
    const endDate = new Date();

    switch (range) {
      case '7days':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo._id',
          category: { $first: '$categoryInfo.name' },
          totalSales: { $sum: '$items.subtotal' },
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error('Error fetching sales by category:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des ventes par catégorie',
      error: error.message,
    });
  }
};

// @desc    Get top selling products
// @route   GET /api/dashboard/top-products
// @access  Private/Admin
exports.getTopProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .sort({ soldCount: -1 })
      .limit(limit)
      .select('name slug price images soldCount stock category');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits populaires',
      error: error.message,
    });
  }
};

// @desc    Get recent orders
// @route   GET /api/dashboard/recent-orders
// @access  Private/Admin
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderNumber customer status total createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes récentes',
      error: error.message,
    });
  }
};

// @desc    Get low stock products
// @route   GET /api/dashboard/low-stock
// @access  Private/Admin
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10;

    const products = await Product.find({
      isActive: true,
      stock: { $lte: threshold },
    })
      .populate('category', 'name')
      .sort({ stock: 1 })
      .select('name slug stock category');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits en faible stock',
      error: error.message,
    });
  }
};

// @desc    Get customer analytics
// @route   GET /api/dashboard/customers
// @access  Private/Admin
exports.getCustomerAnalytics = async (req, res) => {
  try {
    const { range = '30days' } = req.query;

    let startDate;
    const endDate = new Date();

    switch (range) {
      case '7days':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get unique customers
    const customers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$customer.email',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          firstName: { $first: '$customer.firstName' },
          lastName: { $first: '$customer.lastName' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses clients',
      error: error.message,
    });
  }
};

// @desc    Get order status distribution
// @route   GET /api/dashboard/order-status
// @access  Private/Admin
exports.getOrderStatusDistribution = async (req, res) => {
  try {
    const statusData = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: statusData,
    });
  } catch (error) {
    console.error('Error fetching order status distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la distribution des statuts',
      error: error.message,
    });
  }
};

// @desc    Export data (CSV, Excel)
// @route   GET /api/dashboard/export/:type
// @access  Private/Admin
exports.exportData = async (req, res) => {
  try {
    const { type } = req.params;
    const { range = '30days' } = req.query;

    let startDate;
    const endDate = new Date();

    switch (range) {
      case '7days':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    let data;

    switch (type) {
      case 'orders':
        data = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate },
        }).select('orderNumber customer status total createdAt');
        break;

      case 'products':
        data = await Product.find({ isActive: true })
          .populate('category', 'name')
          .select('name price stock soldCount category');
        break;

      case 'contacts':
        data = await Contact.find({
          createdAt: { $gte: startDate, $lte: endDate },
        }).select('name email subject status createdAt');
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Type d\'export invalide',
        });
    }

    // Convert to CSV format (simplified)
    const csv = convertToCSV(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des données',
      error: error.message,
    });
  }
};

// Helper function to convert JSON to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) => {
      const obj = row.toObject ? row.toObject() : row;
      return headers.map((header) => JSON.stringify(obj[header] || '')).join(',');
    }),
  ].join('\n');

  return csv;
}
