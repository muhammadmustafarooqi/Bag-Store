import { NextRequest, NextResponse } from 'next/server';
import Coupon from '@/lib/models/Coupon';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { code, orderTotal } = await req.json();
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid or expired coupon' }, { status: 404 });
    }
    
    if (orderTotal < coupon.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `Minimum order amount is Rs ${coupon.minOrderAmount}`,
      }, { status: 400 });
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: 'Coupon usage limit reached' }, { status: 400 });
    }

    const discount =
      coupon.type === 'percent'
        ? Math.round((orderTotal * coupon.value) / 100)
        : coupon.value;

    return NextResponse.json({ success: true, data: { coupon, discount } });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
