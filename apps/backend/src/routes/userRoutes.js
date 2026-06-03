const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile,
  addAddress, updateAddress, deleteAddress,
  getWishlist, addToWishlist, removeFromWishlist,
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;
