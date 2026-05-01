const express = require('express');
const router = express.Router();
const { uploadImage, deleteUploadedImage } = require('../controllers/uploadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/image', authMiddleware, adminMiddleware, upload.single('image'), uploadImage);
router.delete('/image/:publicId', authMiddleware, adminMiddleware, deleteUploadedImage);

module.exports = router;
