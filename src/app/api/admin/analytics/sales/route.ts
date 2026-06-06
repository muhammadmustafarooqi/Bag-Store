import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import Order from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'week'; // week, month, year

  try {
    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else startDate.setFullYear(startDate.getFullYear() - 1);

    // Sales over time
    const ordersAggregation = await Order.aggregate([
      { $match: { placedAt: { $gte: startDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$placedAt" } },
          revenue: { $sum: "$total" },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format dates to short like "Jun 01"
    const orders = ordersAggregation.map(o => {
      const date = new Date(o._id);
      return {
        _id: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: o.revenue
      };
    });

    // Status breakdown
    const statusBreakdown = await Order.aggregate([
      { $match: { placedAt: { $gte: startDate } } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        statusBreakdown
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
