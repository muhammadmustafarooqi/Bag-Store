import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');
    const phone = url.searchParams.get('phone');

    if (!orderId || !phone) {
      return NextResponse.json({ success: false, message: 'Order ID and Phone Number are required' }, { status: 400 });
    }

    const order = await Order.findOne({
      orderId: new RegExp(`^${orderId}$`, 'i'),
      $or: [
        { 'shippingAddress.phone': phone },
        { 'guestInfo.phone': phone }
      ]
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'No order found with these details.' }, { status: 404 });
    }

    const sanitizedOrder = {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber || '',
      courierName: order.courierName || '',
      items: order.items.map((i: any) => ({
        name: i.name,
        image: i.image,
        qty: i.qty,
        color: i.color
      })),
      total: order.total,
      placedAt: order.placedAt
    };

    return NextResponse.json({ success: true, data: sanitizedOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
