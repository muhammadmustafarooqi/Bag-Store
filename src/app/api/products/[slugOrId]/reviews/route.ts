import { NextRequest, NextResponse } from 'next/server';
import Product from '@/lib/models/Product';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { slugOrId: string } }) {
  await connectDB();
  const { slugOrId } = params;

  try {
    let product;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId).select('reviews ratings');
    } else {
      product = await Product.findOne({ slug: slugOrId }).select('reviews ratings');
    }

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product.reviews, ratings: product.ratings });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { slugOrId: string } }) {
  await connectDB();
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  try {
    const { slugOrId } = params;
    let product;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId);
    } else {
      product = await Product.findOne({ slug: slugOrId });
    }

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const alreadyReviewed = product.reviews.find(
      (r: any) => r.userId?.toString() === user._id.toString()
    );
    if (alreadyReviewed) {
      return NextResponse.json({ success: false, message: 'You have already reviewed this product' }, { status: 400 });
    }

    const { rating, comment } = await req.json();
    product.reviews.push({
      userId: user._id,
      name: user.name,
      rating: Number(rating),
      comment,
    });

    await product.save();
    return NextResponse.json({ success: true, message: 'Review added', data: product.reviews }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
