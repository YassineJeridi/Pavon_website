// backend/router/externalOrders.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createExternalOrder,
  getAllExternalOrders,
  getExternalOrderById,
  updateExternalOrder,
  deleteExternalOrder,
  getCustomerSuggestions,
  getFinancialMetrics,
  getRecurringClients,
  getClientOrders,
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} = require('../controllers/externalOrderController');

// All routes are protected (admin only)
router.use(protect);

// ── Customer name suggestions ────────────────
router.get('/customers/suggest', getCustomerSuggestions);

// ── Financial metrics ───────────────────────
router.get('/metrics/financial', getFinancialMetrics);

// ── Recurring clients ───────────────────────
router.get('/clients/recurring', getRecurringClients);
router.get('/clients/:name/orders', getClientOrders);

// ── Expenses CRUD ───────────────────────────
router.post('/expenses', createExpense);
router.get('/expenses', getAllExpenses);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// ── External orders CRUD ────────────────────
router.post('/', createExternalOrder);
router.get('/', getAllExternalOrders);
router.get('/:id', getExternalOrderById);
router.put('/:id', updateExternalOrder);
router.delete('/:id', deleteExternalOrder);

module.exports = router;
