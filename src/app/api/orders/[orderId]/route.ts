import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  await connectDB();
  const user = await getAuthUser(req);

  try {
    const { orderId } = params;
    const order = await Order.findOne({ orderId }).populate('user', 'name email phone');
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (user?.role !== 'admin' && order.user?._id?.toString() !== user?._id?.toString()) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
