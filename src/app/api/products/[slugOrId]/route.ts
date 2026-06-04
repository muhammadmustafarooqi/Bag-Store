import { NextRequest, NextResponse } from 'next/server';
import Product from '@/lib/models/Product';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest, { params }: { params: { slugOrId: string } }) {
  await connectDB();
  const { slugOrId } = params;

  try {
    let product;
    if (slugOrId && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId);
    }
    
    if (!product) {
      product = await Product.findOne({ slug: slugOrId });
    }

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slugOrId: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const { slugOrId: id } = params;
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

      // Parse types from string representation in FormData
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

      if (body.existingImages) {
        try {
          body.images = JSON.parse(body.existingImages);
        } catch {
          body.images = [];
        }
        delete body.existingImages;
      }

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

      if (body.images) {
        body.images = [...body.images, ...newImages];
      } else {
        body.images = newImages;
      }
    } else {
      body = await req.json();
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    if (body.tags && typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    }
    if (body.colors && typeof body.colors === 'string') {
      body.colors = body.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c);
    }

    if (body.sku === '') {
      delete body.sku;
    }

    const updateQuery: any = { $set: body };
    if (!body.sku) {
      updateQuery.$unset = { sku: 1 };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (err: any) {
    console.error("PUT product error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slugOrId: string } }) {
  await connectDB();
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const { slugOrId: id } = params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Cloudinary deletion handled separately or ignored for now since multer is gone
    await product.deleteOne();
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
