const Category = require('../models/Category');
const { deleteImage } = require('../config/cloudinary');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : undefined;
    const imagePublicId = req.file ? req.file.filename : undefined;
    const category = await Category.create({ ...req.body, image, imagePublicId });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    if (category.imagePublicId) await deleteImage(category.imagePublicId);
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { next(err); }
};
