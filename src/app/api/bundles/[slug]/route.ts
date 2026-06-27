import { NextResponse } from 'next/server';
import Bundle from '@/lib/models/Bundle';
import connectDB from '@/lib/db';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await connectDB();
  try {
    const bundle = await Bundle.findOne({ slug: params.slug, isActive: true }).populate('items.product');
    if (!bundle) {
      return NextResponse.json({ success: false, message: 'Bundle not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: bundle });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
