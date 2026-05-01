const Product = require('../models/Product');
const { deleteImage } = require('../config/cloudinary');
const slugify = require('slugify');

// @desc  Get all products with filters
// @route GET /api/v1/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      color,
      sort = '-createdAt',
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (category) query.category = { $in: category.split(',') };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (color) query.colors = { $in: color.split(',') };
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let sortObj = {};
    switch (sort) {
      case 'price_asc': sortObj = { price: 1 }; break;
      case 'price_desc': sortObj = { price: -1 }; break;
      case 'rating': sortObj = { 'ratings.average': -1 }; break;
      case 'newest': sortObj = { createdAt: -1 }; break;
      default: sortObj = { createdAt: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get featured products
// @route GET /api/v1/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, stock: { $gt: 0 } }).limit(8);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc  Get new arrivals
// @route GET /api/v1/products/new-arrivals
exports.getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNew: true, stock: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single product by slug
// @route GET /api/v1/products/:slug
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc  Create product (admin)
// @route POST /api/v1/products
exports.createProduct = async (req, res, next) => {
  try {
    const images = req.files
      ? req.files.map((f) => ({ url: f.path, publicId: f.filename }))
      : [];

    // Auto-generate slug
    const base = slugify(req.body.name, { lower: true, strict: true });
    let slug = base;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${base}-${counter++}`;
    }

    const product = await Product.create({ ...req.body, images, slug });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc  Update product (admin)
// @route PUT /api/v1/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete product (admin)
// @route DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete all Cloudinary images
    for (const img of product.images) {
      await deleteImage(img.publicId);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc  Add review
// @route POST /api/v1/products/:id/reviews
exports.addReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.userId?.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const { rating, comment } = req.body;
    product.reviews.push({
      userId: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    await product.save();
    res.status(201).json({ success: true, message: 'Review added', data: product.reviews });
  } catch (err) {
    next(err);
  }
};

// @desc  Get reviews
// @route GET /api/v1/products/:id/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select('reviews ratings');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product.reviews, ratings: product.ratings });
  } catch (err) {
    next(err);
  }
};
