import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import VisitorSession from '@/lib/models/VisitorSession';
import AnalyticsEvent from '@/lib/models/AnalyticsEvent';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { sessionId, path, referrer, hasCart, hasCheckout, hasOrdered } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Session ID is required' }, { status: 400 });
    }

    // Extract IP and User-Agent
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';

    // Upsert the visitor session
    await VisitorSession.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          ip,
          userAgent,
          referrer,
          lastActive: new Date(),
        },
        $max: {
          hasCart: !!hasCart,
          hasCheckout: !!hasCheckout,
          hasOrdered: !!hasOrdered,
        },
      },
      { upsert: true, new: true }
    );

    // 1. Record 'page_view' if not logged in the last 1 minute for this path/session
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentPageView = await AnalyticsEvent.findOne({
      sessionId,
      eventName: 'page_view',
      path,
      createdAt: { $gte: oneMinuteAgo },
    });
    if (!recentPageView) {
      await AnalyticsEvent.create({ sessionId, eventName: 'page_view', path });
    }

    // 2. Record 'add_to_cart' milestone if hasCart is true and it hasn't been logged yet for this session
    if (hasCart) {
      const existingCartEvent = await AnalyticsEvent.findOne({ sessionId, eventName: 'add_to_cart' });
      if (!existingCartEvent) {
        await AnalyticsEvent.create({ sessionId, eventName: 'add_to_cart', path });
      }
    }

    // 3. Record 'initiate_checkout' milestone if hasCheckout is true and it hasn't been logged yet
    if (hasCheckout) {
      const existingCheckoutEvent = await AnalyticsEvent.findOne({ sessionId, eventName: 'initiate_checkout' });
      if (!existingCheckoutEvent) {
        await AnalyticsEvent.create({ sessionId, eventName: 'initiate_checkout', path });
      }
    }

    // 4. Record 'purchase' milestone if hasOrdered is true and it hasn't been logged yet
    if (hasOrdered) {
      const existingPurchaseEvent = await AnalyticsEvent.findOne({ sessionId, eventName: 'purchase' });
      if (!existingPurchaseEvent) {
        await AnalyticsEvent.create({ sessionId, eventName: 'purchase', path });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
