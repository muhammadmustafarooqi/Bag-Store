import { NextRequest, NextResponse } from 'next/server';
import Faq from '@/lib/models/Faq';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await getAuthUser(req, true);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const faq = await Faq.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!faq) return NextResponse.json({ success: false, message: 'FAQ not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: faq });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await getAuthUser(req, true);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const faq = await Faq.findByIdAndDelete(params.id);
    if (!faq) return NextResponse.json({ success: false, message: 'FAQ not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
