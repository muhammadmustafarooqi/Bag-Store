import { NextResponse } from 'next/server';
import Bundle from '@/lib/models/Bundle';
import connectDB from '@/lib/db';

export async function GET() {
  await connectDB();
  try {
    const bundles = await Bundle.find({ isActive: true }).populate('items.product').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bundles });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
