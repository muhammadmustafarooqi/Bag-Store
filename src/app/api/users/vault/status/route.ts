import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import Coupon from '@/lib/models/Coupon';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await connectDB();
  const authUser = await getAuthUser(req);

  if (!authUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await User.findById(authUser._id).select('hasOpenedVault vaultPrize vaultCouponCode vaultOpenedAt');

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    let couponStatus = null;

    if (user.hasOpenedVault && user.vaultCouponCode) {
      const coupon = await Coupon.findOne({ code: user.vaultCouponCode });
      if (coupon) {
        couponStatus = {
          code: coupon.code,
          expiresAt: coupon.expiresAt,
          isActive: coupon.isActive && (coupon.usageLimit ? coupon.usedCount < coupon.usageLimit : true) && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()),
        };
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        hasOpenedVault: user.hasOpenedVault,
        vaultPrize: user.vaultPrize,
        vaultOpenedAt: user.vaultOpenedAt,
        coupon: couponStatus
      } 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
