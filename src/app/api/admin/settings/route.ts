import { NextRequest, NextResponse } from 'next/server';
import Settings from '@/lib/models/Settings';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await connectDB();
  const user = await getAuthUser(req, true);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const user = await getAuthUser(req, true);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const settings = await Settings.findOneAndUpdate({}, body, { new: true, upsert: true, runValidators: true });
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
