import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const { orderId } = params;
    const { orderStatus, paymentStatus } = await req.json();

    // Use MongoDB Object ID if it matches 24 hex char, otherwise assume the short `orderId`
    let idFilter = {};
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
        idFilter = { _id: orderId };
    } else {
        idFilter = { orderId };
    }

    const update: any = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findOneAndUpdate(idFilter, update, { new: true });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
