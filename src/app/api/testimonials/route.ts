import { NextRequest, NextResponse } from 'next/server';
import Testimonial from '@/lib/models/Testimonial';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
