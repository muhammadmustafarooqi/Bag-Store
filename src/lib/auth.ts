import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from './db';
import User from './models/User';

export async function getAuthUser(req: NextRequest, requireAdmin = false) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    await connectDB();
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) return null;

    if (requireAdmin && user.role !== 'admin') {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
}

export async function getOptionalAuthUser(req: NextRequest) {
  return getAuthUser(req, false);
}
