import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Coupon from '@/lib/models/Coupon';
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await getAuthUser(req); // Optional

  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'COD',
      couponCode,
      notes,
      guestInfo,
    } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Order must have at least one item' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product ${item.product} not found` }, { status: 404 });
      }
      if (product.stock < item.qty) {
        return NextResponse.json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        }, { status: 400 });
      }

      const price = product.onSale ? product.salePrice : product.price;
      subtotal += price * item.qty;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price,
        qty: item.qty,
        color: item.color,
      });
    }

    const FREE_THRESHOLD = Number(process.env.FREE_SHIPPING_THRESHOLD || 2000);
    const SHIPPING_FEE = Number(process.env.SHIPPING_FEE || 200);
    const shippingFee = subtotal >= FREE_THRESHOLD ? 0 : SHIPPING_FEE;

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });
      if (coupon) {
        if (subtotal >= coupon.minOrderAmount) {
          if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
            discount = coupon.type === 'percent'
              ? Math.round((subtotal * coupon.value) / 100)
              : coupon.value;
            coupon.usedCount += 1;
            await coupon.save();
          }
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
      couponCode: couponCode?.toUpperCase(),
    };

    if (user) {
      orderData.user = user._id;
    } else {
      orderData.guestInfo = guestInfo;
    }

    const order = await Order.create(orderData);

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
