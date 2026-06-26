import { NextRequest, NextResponse } from 'next/server';
import Settings from '@/lib/models/Settings';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
