import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '@/lib/models/User';
import connectDB from '@/lib/db';
import sendEmail from '@/lib/sendEmail'; // Need to create this
import axios from 'axios';
import { getAuthUser } from '@/lib/auth';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
  return { accessToken, refreshToken };
};

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
  await connectDB();
  const { action } = params;

  try {
    const body = await req.json().catch(() => ({}));

    switch (action) {
      case 'register': {
        const { name, email, password, phone } = body;
        const existing = await User.findOne({ email });
        if (existing) {
          return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
        }

        const verificationToken = crypto.randomBytes(20).toString('hex');
        const user = await User.create({ name, email, password, phone, verificationToken });
        const { accessToken, refreshToken } = generateTokens(user._id.toString());

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
        try {
          await sendEmail({
            email: user.email,
            subject: 'Verify your KAARVAN account',
            html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                     <h2 style="color: #c8a96e;">Welcome to KAARVAN!</h2>
                     <p>Thank you for registering. Please click the button below to verify your account:</p>
                     <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #c8a96e; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Verify Email</a>
                   </div>`,
          });
        } catch (err) {
          console.error('Email could not be sent', err);
        }

        return NextResponse.json({
          success: true,
          message: 'Registration successful. Please check your email to verify your account.',
          data: {
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
            accessToken,
            refreshToken,
          },
        }, { status: 201 });
      }

      case 'login': {
        const { email, password } = body;
        if (!email || !password) {
          return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('+password +refreshToken');
        if (!user || !(await user.comparePassword(password))) {
          return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return NextResponse.json({
          success: true,
          message: 'Login successful',
          data: {
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
            accessToken,
            refreshToken,
          },
        });
      }

      case 'logout': {
        const { refreshToken } = body;
        if (refreshToken) {
          await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        }
        return NextResponse.json({ success: true, message: 'Logged out successfully' });
      }

      case 'refresh-token': {
        const { refreshToken } = body;
        if (!refreshToken) {
          return NextResponse.json({ success: false, message: 'Refresh token required' }, { status: 401 });
        }

        try {
          const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;
          const user = await User.findById(decoded.id).select('+refreshToken');

          if (!user || user.refreshToken !== refreshToken) {
            return NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
          }

          const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());
          user.refreshToken = newRefreshToken;
          await user.save({ validateBeforeSave: false });

          return NextResponse.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
        } catch (err: any) {
          if (err.name === 'TokenExpiredError') {
            return NextResponse.json({ success: false, message: 'Refresh token expired. Please login again.' }, { status: 401 });
          }
          return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
      }

      case 'verify-email': {
        const { token } = body;
        const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
        
        if (!user) {
          return NextResponse.json({ success: false, message: 'Invalid or expired verification token' }, { status: 400 });
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });
        
        return NextResponse.json({ success: true, message: 'Email verified successfully' });
      }

      case 'forgot-password': {
        const user = await User.findOne({ email: body.email });
        if (!user) {
          return NextResponse.json({ success: false, message: 'There is no user with that email' }, { status: 404 });
        }
        
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        
        try {
          await sendEmail({
            email: user.email,
            subject: 'KAARVAN Password Reset',
            html: `<p>You requested a password reset. Click the link below to set a new password:</p>
                   <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #c8a96e; color: #000; text-decoration: none; border-radius: 5px;">Reset Password</a>`,
          });
          return NextResponse.json({ success: true, message: 'Password reset email sent' });
        } catch (err) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save({ validateBeforeSave: false });
          return NextResponse.json({ success: false, message: 'Email could not be sent' }, { status: 500 });
        }
      }

      case 'reset-password': {
        const resetPasswordToken = crypto.createHash('sha256').update(body.token).digest('hex');
        const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpire');

        if (!user) {
          return NextResponse.json({ success: false, message: 'Invalid or expired reset token' }, { status: 400 });
        }

        user.password = body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return NextResponse.json({ success: true, message: 'Password reset successful', data: { accessToken, refreshToken } });
      }

      case 'google': {
        const { token } = body;
        const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const { sub: googleId, email, name } = googleRes.data;

        let user = await User.findOne({ email }).select('+refreshToken');
        
        if (!user) {
          user = await User.create({
            name,
            email,
            googleId,
            isVerified: true
          });
        } else if (!user.googleId) {
          user.googleId = googleId;
          user.isVerified = true;
          await user.save({ validateBeforeSave: false });
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return NextResponse.json({
          success: true,
          message: 'Google Login successful',
          data: {
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
            accessToken,
            refreshToken,
          },
        });
      }

      default:
        return NextResponse.json({ success: false, message: 'Action not found' }, { status: 404 });
    }
  } catch (err: any) {
    console.error(`Auth Error (${action}):`, err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { action: string } }) {
  await connectDB();
  const { action } = params;

  try {
    if (action === 'me') {
      const authUser = await getAuthUser(req);
      if (!authUser) {
        return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
      }
      
      const user = await User.findById(authUser._id).populate('wishlist', 'name slug images price salePrice onSale');
      return NextResponse.json({ success: true, data: user });
    }

    return NextResponse.json({ success: false, message: 'Action not found' }, { status: 404 });
  } catch (err: any) {
    console.error(`Auth Error (${action}):`, err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
