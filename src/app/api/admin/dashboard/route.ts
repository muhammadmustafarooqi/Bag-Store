import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required or session expired' }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, totalOrders, pendingOrders, lowStockProducts, recentOrders] = await Promise.all([
      Order.find({ placedAt: { $gte: today }, paymentStatus: 'paid' }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ['placed', 'confirmed'] } }),
      Product.find({ stock: { $lte: 5 } }).select('name category stock').limit(5).lean(),
      Order.find().sort({ placedAt: -1 }).limit(5).populate('user', 'name').lean()
    ]);

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({
      success: true,
      data: {
        todayRevenue,
        totalOrders,
        pendingOrders,
        lowStockCount: await Product.countDocuments({ stock: { $lte: 5 } }),
        lowStockProducts,
        recentOrders,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
