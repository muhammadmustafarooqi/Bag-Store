import { NextRequest, NextResponse } from 'next/server';
import Faq from '@/lib/models/Faq';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
