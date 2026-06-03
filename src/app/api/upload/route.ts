import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const admin = await getAuthUser(req, true);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const folder = formData.get('folder') as string || 'kaarvan/misc';
    
    // Support multiple files under the key 'images' or 'file'
    const files = formData.getAll('images').length > 0 
        ? formData.getAll('images') 
        : formData.getAll('file');

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files uploaded' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file: any) => {
      // Convert File to ArrayBuffer to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
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

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, data: results });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
