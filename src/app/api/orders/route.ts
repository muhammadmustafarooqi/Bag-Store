import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Coupon from '@/lib/models/Coupon';
import Bundle from '@/lib/models/Bundle';
import Settings from '@/lib/models/Settings';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await getAuthUser(req); // Optional

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'COD',
      couponCode,
      notes,
      isGift,
      giftMessage,
      guestInfo,
    } = await req.json();

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ success: false, message: 'Order must have at least one item' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      if (item.isBundle) {
        const bundle = await Bundle.findById(item.product).populate('items.product').session(session);
        if (!bundle || !bundle.isActive) {
          throw new Error(`Bundle not found or inactive`);
        }
        subtotal += bundle.bundlePrice * item.qty;
        
        const subProducts = [];
        for (const bItem of bundle.items) {
           const prod = bItem.product as any;
           if (prod.stock < item.qty * bItem.quantity) {
              throw new Error(`Insufficient stock for bundle item ${prod.name}. Available: ${prod.stock}`);
           }
           await Product.findByIdAndUpdate(prod._id, { $inc: { stock: -(item.qty * bItem.quantity) } }, { session });
           subProducts.push({ product: prod._id, quantity: item.qty * bItem.quantity });
        }

        orderItems.push({
          product: null,
          name: bundle.name,
          image: bundle.image?.url || '',
          price: bundle.bundlePrice,
          qty: item.qty,
          isBundle: true,
          bundleId: bundle._id,
          selectedBundleItems: subProducts
        });
      } else {
        const product = await Product.findById(item.product).session(session);
        if (!product) throw new Error(`Product ${item.product} not found`);
        if (product.stock < item.qty) throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        
        const price = product.onSale ? product.salePrice : product.price;
        subtotal += price * item.qty;

        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.qty } }, { session });

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.images[0]?.url || '',
          price,
          qty: item.qty,
          color: item.color,
        });
      }
    }

    const settings = await Settings.findOne().session(session) || { shippingFee: 200 };
    const FREE_THRESHOLD = couponCode ? 7000 : 3500;
    const SHIPPING_FEE = settings.shippingFee || 200;
    const shippingFee = subtotal >= FREE_THRESHOLD ? 0 : SHIPPING_FEE;

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      }).session(session);
      
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          discount = coupon.type === 'percent'
            ? Math.round((subtotal * coupon.value) / 100)
            : coupon.value;
          coupon.usedCount += 1;
          await coupon.save({ session });
        }
      }
    }

    const total = subtotal + shippingFee - discount;

    const orderData: any = {
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      total,
      notes,
      isGift,
      giftMessage,
      couponCode: couponCode?.toUpperCase(),
    };

    if (user) {
      orderData.user = user._id;
    } else {
      orderData.guestInfo = guestInfo;
    }

    const [order] = await Order.create([orderData], { session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
