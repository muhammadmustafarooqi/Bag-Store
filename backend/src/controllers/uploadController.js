const { deleteImage } = require('../config/cloudinary');

// POST /api/v1/upload/image (admin only)
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    res.json({
      success: true,
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  } catch (err) { next(err); }
};

// DELETE /api/v1/upload/image/:publicId (admin only)
exports.deleteUploadedImage = async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await deleteImage(publicId);
    res.json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (err) { next(err); }
};
