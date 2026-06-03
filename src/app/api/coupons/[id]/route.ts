import { NextRequest, NextResponse } from 'next/server';
import Coupon from '@/lib/models/Coupon';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const { id } = params;
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
