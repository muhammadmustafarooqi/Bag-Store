import { NextRequest, NextResponse } from 'next/server';
import Bundle from '@/lib/models/Bundle';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
  }

  try {
    const bundles = await Bundle.find().populate('items.product').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bundles });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const bundle = await Bundle.create(data);
    return NextResponse.json({ success: true, data: bundle }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
