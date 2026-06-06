import { NextRequest, NextResponse } from 'next/server';
import Product from '@/lib/models/Product';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import slugify from 'slugify';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  await connectDB();
  const url = new URL(req.url);

  const category = url.searchParams.get('category');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const color = url.searchParams.get('color');
  const sort = url.searchParams.get('sort') || '-createdAt';
  const search = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '12');
  const isFeatured = url.searchParams.get('isFeatured');
  const isNewArrival = url.searchParams.get('isNewArrival');

  const query: any = {};

  if (category) query.category = { $in: category.toLowerCase().split(',') };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (color) query.colors = { $in: color.split(',') };
  if (search) {
    query.$text = { $search: search };
  }
  if (isFeatured === 'true') {
    query.isFeatured = true;
    query.stock = { $gt: 0 };
  }
  if (isNewArrival === 'true') {
    query.isNew = true;
    query.stock = { $gt: 0 };
  }

  const skip = (page - 1) * limit;

  let sortObj: any = {};
  switch (sort) {
    case 'price_asc': sortObj = { price: 1 }; break;
    case 'price_desc': sortObj = { price: -1 }; break;
    case 'rating': sortObj = { 'ratings.average': -1 }; break;
    case 'newest': sortObj = { createdAt: -1 }; break;
    default: sortObj = { createdAt: -1 };
  }

  try {
    const isPriceSort = sort === 'price_asc' || sort === 'price_desc';
    let products, total;

    if (isPriceSort) {
      const sortOrder = sort === 'price_asc' ? 1 : -1;
      const pipeline: any[] = [
        { $match: query },
        {
          $addFields: {
            effectivePrice: {
              $cond: { if: "$onSale", then: "$salePrice", else: "$price" }
            }
          }
        },
        { $sort: { effectivePrice: sortOrder, _id: 1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }]
          }
        }
      ];
      
      const result = await Product.aggregate(pipeline);
      products = result[0].data;
      total = result[0].metadata[0]?.total || 0;
    } else {
      [products, total] = await Promise.all([
        Product.find(query).sort(sortObj).skip(skip).limit(limit),
        Product.countDocuments(query),
      ]);
    }

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let body: any = {};
    let newImages: any[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        if (key !== 'images') {
          body[key] = value;
        }
      });

      // Parse types
      if (body.price !== undefined) body.price = Number(body.price);
      if (body.stock !== undefined) body.stock = Number(body.stock);
      if (body.salePrice !== undefined && body.salePrice !== '') {
        body.salePrice = Number(body.salePrice);
      } else {
        body.salePrice = undefined;
      }
      if (body.onSale !== undefined) body.onSale = body.onSale === 'true';
      if (body.isFeatured !== undefined) body.isFeatured = body.isFeatured === 'true';
      if (body.isNew !== undefined) body.isNew = body.isNew === 'true';

      const files = formData.getAll('images');
      if (files && files.length > 0 && files[0] && (files[0] as any).name) {
        const uploadPromises = files.map(async (file: any) => {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: `kaarvan/products/${body.category || 'misc'}` },
              (error, result) => {
                if (error) return reject(error);
                resolve({
                  url: result?.secure_url,
                  publicId: result?.public_id,
                });
              }
            );
            uploadStream.end(buffer);
          });
        });
        newImages = await Promise.all(uploadPromises);
      }
      body.images = newImages;
    } else {
      body = await req.json();
    }
    
    // Auto-generate slug
    const base = slugify(body.name, { lower: true, strict: true });
    let slug = base;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${base}-${counter++}`;
    }

    if (body.tags && typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    }
    if (body.colors && typeof body.colors === 'string') {
      body.colors = body.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c);
    }

    const product = await Product.create({ ...body, slug });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
