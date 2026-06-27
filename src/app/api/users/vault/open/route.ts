import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import Coupon from '@/lib/models/Coupon';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import crypto from 'crypto';

const PRIZES = [
  { name: '5% OFF', weight: 30, type: 'percent', value: 5 },
  { name: '10% OFF', weight: 25, type: 'percent', value: 10 },
  { name: 'Free Shipping', weight: 20, type: 'flat', value: 250 }, // Assuming 250 PKR covers standard shipping
  { name: '15% OFF', weight: 12, type: 'percent', value: 15 },
  { name: 'Rs.300 Voucher', weight: 8, type: 'flat', value: 300 },
  { name: '20% OFF', weight: 4, type: 'percent', value: 20 },
  { name: 'Free Gift', weight: 1, type: 'flat', value: 500 }, // Representing free gift value
];

function selectPrize() {
  const totalWeight = PRIZES.reduce((sum, prize) => sum + prize.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const prize of PRIZES) {
    if (random < prize.weight) {
      return prize;
    }
    random -= prize.weight;
  }
  return PRIZES[0];
}

export async function POST(req: NextRequest) {
  await connectDB();
  const authUser = await getAuthUser(req);

  if (!authUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await User.findById(authUser._id);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.hasOpenedVault && user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Vault already opened' }, { status: 400 });
    }

    const prize = selectPrize();
    
    // Generate a unique coupon code
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const couponCode = `VAULT-${randomSuffix}`;
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const coupon = await Coupon.create({
      code: couponCode,
      type: prize.type,
      value: prize.value,
      usageLimit: 1,
      expiresAt: expiresAt,
      isActive: true,
    });

    user.hasOpenedVault = true;
    user.vaultPrize = prize.name;
    user.vaultCouponCode = coupon.code;
    user.vaultOpenedAt = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        prizeName: prize.name,
        couponCode: coupon.code,
        expiresAt: coupon.expiresAt,
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

