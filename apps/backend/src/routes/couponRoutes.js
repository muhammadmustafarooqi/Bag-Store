const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon, getCoupons, deleteCoupon } = require('../controllers/couponController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/validate', validateCoupon);
router.get('/', authMiddleware, adminMiddleware, getCoupons);
router.post('/', authMiddleware, adminMiddleware, createCoupon);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCoupon);

module.exports = router;
