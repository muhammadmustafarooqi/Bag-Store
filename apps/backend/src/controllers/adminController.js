const { User, Product, Order } = require('@kaarvan/db');

// GET /api/v1/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayOrders,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      Order.find({ placedAt: { $gte: today, $lt: tomorrow } }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'placed' }),
      Product.find({ stock: { $gt: 0, $lte: 5 } }).select('name stock images category').limit(10),
      Order.find().sort({ placedAt: -1 }).limit(10).populate('user', 'name email'),
    ]);

    const todayRevenue = todayOrders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    res.json({
      success: true,
      data: {
        todayRevenue,
        totalOrders,
        pendingOrders,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/v1/admin/analytics/sales
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;
    let days = period === 'month' ? 30 : period === 'year' ? 365 : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.aggregate([
      { $match: { placedAt: { $gte: startDate }, orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$placedAt' },
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: { orders, statusBreakdown } });
  } catch (err) { next(err); }
};

// GET /api/v1/admin/customers
exports.getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'customer' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};
