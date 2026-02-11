// backend/controllers/externalOrderController.js

const ExternalOrder = require('../models/ExternalOrder');
const Expense = require('../models/Expense');

// ──────────────────────────────────────────────
//  EXTERNAL ORDERS CRUD
// ──────────────────────────────────────────────

// @desc    Create a new external order
// @route   POST /api/external-orders
// @access  Private/Admin
exports.createExternalOrder = async (req, res) => {
  try {
    const { source, amount, date, customerName, notes } = req.body;

    const order = await ExternalOrder.create({
      source,
      amount,
      date,
      customerName: customerName || '',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Commande externe créée avec succès',
      data: order,
    });
  } catch (error) {
    console.error('Error creating external order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la commande',
    });
  }
};

// @desc    Get all external orders (with filters, sorting, pagination)
// @route   GET /api/external-orders
// @access  Private/Admin
exports.getAllExternalOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
      source,
      startDate,
      endDate,
      search,
    } = req.query;

    // Build filter
    const filter = {};

    if (source) {
      filter.source = source;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (search) {
      filter.customerName = { $regex: search, $options: 'i' };
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ExternalOrder.countDocuments(filter);

    const orders = await ExternalOrder.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching external orders:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
    });
  }
};

// @desc    Get single external order
// @route   GET /api/external-orders/:id
// @access  Private/Admin
exports.getExternalOrderById = async (req, res) => {
  try {
    const order = await ExternalOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande externe non trouvée',
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching external order:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande',
    });
  }
};

// @desc    Update external order
// @route   PUT /api/external-orders/:id
// @access  Private/Admin
exports.updateExternalOrder = async (req, res) => {
  try {
    const { source, amount, date, customerName, notes } = req.body;

    const order = await ExternalOrder.findByIdAndUpdate(
      req.params.id,
      { source, amount, date, customerName, notes },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande externe non trouvée',
      });
    }

    res.json({
      success: true,
      message: 'Commande mise à jour avec succès',
      data: order,
    });
  } catch (error) {
    console.error('Error updating external order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour',
    });
  }
};

// @desc    Delete external order
// @route   DELETE /api/external-orders/:id
// @access  Private/Admin
exports.deleteExternalOrder = async (req, res) => {
  try {
    const order = await ExternalOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande externe non trouvée',
      });
    }

    res.json({
      success: true,
      message: 'Commande supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting external order:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
    });
  }
};

// ──────────────────────────────────────────────
//  CUSTOMER NAME SUGGESTIONS
// ──────────────────────────────────────────────

// @desc    Get distinct customer names matching a query
// @route   GET /api/external-orders/customers/suggest
// @access  Private/Admin
exports.getCustomerSuggestions = async (req, res) => {
  try {
    const { q = '' } = req.query;

    const filter = {
      customerName: { $ne: '', $exists: true },
    };

    if (q.trim()) {
      filter.customerName.$regex = q.trim();
      filter.customerName.$options = 'i';
    }

    const names = await ExternalOrder.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $toLower: { $trim: { input: '$customerName' } } },
          customerName: { $first: '$customerName' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: names.map((n) => ({ name: n.customerName, orderCount: n.orderCount })),
    });
  } catch (error) {
    console.error('Error fetching customer suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des suggestions',
    });
  }
};

// ──────────────────────────────────────────────
//  FINANCIAL METRICS
// ──────────────────────────────────────────────

// @desc    Get financial metrics (revenue, expenses, net profit)
// @route   GET /api/external-orders/metrics/financial
// @access  Private/Admin
exports.getFinancialMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.date.$lte = end;
      }
    }

    // Total revenue from external orders
    const revenueAgg = await ExternalOrder.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$amount' },
        },
      },
    ]);

    // Revenue by source
    const revenueBySource = await ExternalOrder.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$source',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Total expenses
    const expenseAgg = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          expenseCount: { $sum: 1 },
        },
      },
    ]);

    // Expenses by category
    const expensesByCategory = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const totalExpenses = expenseAgg[0]?.totalExpenses || 0;
    const netProfit = totalRevenue - totalExpenses;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        orderCount: revenueAgg[0]?.orderCount || 0,
        avgOrderValue: revenueAgg[0]?.avgOrderValue || 0,
        revenueBySource,
        expensesByCategory,
      },
    });
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des métriques',
    });
  }
};

// ──────────────────────────────────────────────
//  RECURRING CLIENTS
// ──────────────────────────────────────────────

// @desc    Get recurring clients with order stats
// @route   GET /api/external-orders/clients/recurring
// @access  Private/Admin
exports.getRecurringClients = async (req, res) => {
  try {
    const clients = await ExternalOrder.aggregate([
      // Only consider orders that have a customer name
      { $match: { customerName: { $ne: '', $exists: true } } },
      {
        $group: {
          _id: { $toLower: { $trim: { input: '$customerName' } } },
          customerName: { $first: '$customerName' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$amount' },
          lastOrderDate: { $max: '$date' },
          firstOrderDate: { $min: '$date' },
          sources: { $addToSet: '$source' },
        },
      },
      { $sort: { orderCount: -1, totalSpent: -1 } },
    ]);

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error('Error fetching recurring clients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients',
    });
  }
};

// @desc    Get order history for a specific client
// @route   GET /api/external-orders/clients/:name/orders
// @access  Private/Admin
exports.getClientOrders = async (req, res) => {
  try {
    const { name } = req.params;
    const orders = await ExternalOrder.find({
      customerName: { $regex: new RegExp(`^${name}$`, 'i') },
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching client orders:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'historique client",
    });
  }
};

// ──────────────────────────────────────────────
//  EXPENSES CRUD
// ──────────────────────────────────────────────

// @desc    Create a new expense
// @route   POST /api/external-orders/expenses
// @access  Private/Admin
exports.createExpense = async (req, res) => {
  try {
    const { label, amount, date, category, customCategory, notes } = req.body;

    const expense = await Expense.create({
      label,
      amount,
      date,
      category: category || 'Autre',
      customCategory: category === 'Autre' ? (customCategory || '') : '',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Charge créée avec succès',
      data: expense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la charge',
    });
  }
};

// @desc    Get all expenses
// @route   GET /api/external-orders/expenses
// @access  Private/Admin
exports.getAllExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des charges',
    });
  }
};

// @desc    Update expense
// @route   PUT /api/external-orders/expenses/:id
// @access  Private/Admin
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Charge non trouvée',
      });
    }

    res.json({
      success: true,
      message: 'Charge mise à jour avec succès',
      data: expense,
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de la charge',
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/external-orders/expenses/:id
// @access  Private/Admin
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Charge non trouvée',
      });
    }

    res.json({
      success: true,
      message: 'Charge supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la charge',
    });
  }
};
