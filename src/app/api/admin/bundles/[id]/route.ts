import { NextRequest, NextResponse } from 'next/server';
import Bundle from '@/lib/models/Bundle';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const bundle = await Bundle.findByIdAndUpdate(params.id, data, { new: true });
    if (!bundle) return NextResponse.json({ success: false, message: 'Bundle not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: bundle });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
  }

  try {
    const bundle = await Bundle.findByIdAndDelete(params.id);
    if (!bundle) return NextResponse.json({ success: false, message: 'Bundle not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Bundle deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
