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

export async function DELETE(req: NextRequest, { params }: { params: { orderId: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const { orderId } = params;
    let idFilter = {};
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
        idFilter = { _id: orderId };
    } else {
        idFilter = { orderId };
    }

    const order = await Order.findOneAndDelete(idFilter);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { orderId: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const { orderId } = params;
    const body = await req.json();
    const { orderStatus, paymentStatus, trackingNumber, courierName } = body;

    let idFilter = {};
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      idFilter = { _id: orderId };
    } else {
      idFilter = { orderId };
    }

    const update: any = {};
    if (orderStatus !== undefined) update.orderStatus = orderStatus;
    if (paymentStatus !== undefined) update.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;
    if (courierName !== undefined) update.courierName = courierName;

    // Automatically transitions status to 'shipped' if tracking data is appended
    if (trackingNumber && courierName && !update.orderStatus) {
      update.orderStatus = 'shipped';
    }

    const order = await Order.findOneAndUpdate(idFilter, update, { new: true });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
