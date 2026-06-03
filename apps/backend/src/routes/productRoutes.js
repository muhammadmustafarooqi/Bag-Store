const express = require('express');
const router = express.Router();
const {
  getProducts, getFeaturedProducts, getNewArrivals,
  getProduct, createProduct, updateProduct, deleteProduct,
  addReview, getReviews,
} = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:slug', getProduct);
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 10), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 10), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
router.post('/:id/reviews', authMiddleware, addReview);
router.get('/:id/reviews', getReviews);

module.exports = router;
