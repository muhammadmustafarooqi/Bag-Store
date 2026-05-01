const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc  Place order (auth or guest)
// @route POST /api/v1/orders
exports.placeOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'COD',
      couponCode,
      notes,
      guestInfo,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    // Validate stock and calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const price = product.onSale ? product.salePrice : product.price;
      subtotal += price * item.qty;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price,
        qty: item.qty,
        color: item.color,
      });
    }

    // Shipping fee
    const FREE_THRESHOLD = Number(process.env.FREE_SHIPPING_THRESHOLD || 2000);
    const SHIPPING_FEE = Number(process.env.SHIPPING_FEE || 200);
    const shippingFee = subtotal >= FREE_THRESHOLD ? 0 : SHIPPING_FEE;

    // Coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });
      if (coupon) {
        if (subtotal >= coupon.minOrderAmount) {
          if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
            discount = coupon.type === 'percent'
              ? Math.round((subtotal * coupon.value) / 100)
              : coupon.value;
            coupon.usedCount += 1;
            await coupon.save();
          }
        }
      }
    }

    const total = subtotal + shippingFee - discount;

    const orderData = {
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      total,
      notes,
      couponCode: couponCode?.toUpperCase(),
    };

    if (req.user) {
      orderData.user = req.user._id;
    } else {
      orderData.guestInfo = guestInfo;
    }

    const order = await Order.create(orderData);

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc  Get my orders
// @route GET /api/v1/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ placedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single order
// @route GET /api/v1/orders/:orderId
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user owns it (or admin)
    if (req.user?.role !== 'admin' && order.user?._id?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc  Update order status (admin)
// @route PUT /api/v1/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc  Update tracking (admin)
// @route PUT /api/v1/orders/:id/tracking
exports.updateTracking = async (req, res, next) => {
  try {
    const { trackingNumber, courierName } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { trackingNumber, courierName, orderStatus: 'shipped' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc  Cancel order (customer)
// @route POST /api/v1/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${order.orderStatus} order` });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (err) {
    next(err);
  }
};

// @desc  Admin: get all orders
// @route GET /api/v1/admin/orders
exports.getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20, dateFrom, dateTo } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        { 'guestInfo.phone': { $regex: search, $options: 'i' } },
      ];
    }
    if (dateFrom || dateTo) {
      query.placedAt = {};
      if (dateFrom) query.placedAt.$gte = new Date(dateFrom);
      if (dateTo) query.placedAt.$lte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ placedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};
