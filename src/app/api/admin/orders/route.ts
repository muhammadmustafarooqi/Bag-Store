import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required or session expired' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    const query: any = {};

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

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ placedAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
