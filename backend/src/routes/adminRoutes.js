const express = require('express');
const router = express.Router();
const { getDashboard, getSalesAnalytics, getCustomers } = require('../controllers/adminController');
const { getAdminOrders } = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', getDashboard);
router.get('/orders', getAdminOrders);
router.get('/customers', getCustomers);
router.get('/analytics/sales', getSalesAnalytics);

module.exports = router;
