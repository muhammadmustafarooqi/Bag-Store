const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getCategories);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createCategory);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
