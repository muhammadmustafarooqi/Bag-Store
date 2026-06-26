import { NextRequest, NextResponse } from 'next/server';
import Testimonial from '@/lib/models/Testimonial';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await getAuthUser(req, true);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const testimonial = await Testimonial.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!testimonial) return NextResponse.json({ success: false, message: 'Testimonial not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await getAuthUser(req, true);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const testimonial = await Testimonial.findByIdAndDelete(params.id);
    if (!testimonial) return NextResponse.json({ success: false, message: 'Testimonial not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
