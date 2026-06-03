const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrder,
  updateOrderStatus, updateTracking, cancelOrder, trackOrder,
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, placeOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/track', trackOrder);
router.get('/:orderId', optionalAuth, getOrder);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.put('/:id/tracking', authMiddleware, adminMiddleware, updateTracking);
router.post('/:id/cancel', authMiddleware, cancelOrder);

module.exports = router;
