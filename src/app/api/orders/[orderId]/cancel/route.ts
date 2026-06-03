import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  await connectDB();
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  try {
    const { orderId } = params;
    
    let idFilter = {};
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
        idFilter = { _id: orderId };
    } else {
        idFilter = { orderId };
    }

    const order = await Order.findOne(idFilter);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.user?.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return NextResponse.json({ success: false, message: `Cannot cancel a ${order.orderStatus} order` }, { status: 400 });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    return NextResponse.json({ success: true, message: 'Order cancelled', data: order });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
