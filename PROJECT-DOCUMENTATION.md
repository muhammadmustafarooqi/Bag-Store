# AllNone Store / KAARVAN - Project Documentation

## 1. Project Overview
- **Platform Overview**: "AllNone Store" (branded as KAARVAN within the codebase) is an e-commerce platform dedicated to selling bags, including handbags, backpacks, laptop bags, totes, travel bags, and wallets.
- **Target Market**: Focused on the Pakistani market, featuring province-specific shipping (Punjab, Sindh, KPK, Balochistan, AJK, GB, Islamabad), phone number validation (`03XXXXXXXXX`), and local payment methods.
- **Business Model**: Direct-to-Consumer (D2C) retail.
- **Tech Stack**:
  - **Frontend / Framework**: Next.js 14.2.35 (App Router) with React 18.
  - **Styling**: Tailwind CSS 3.4.1, Framer Motion.
  - **Backend**: Next.js API Routes (Serverless backend).
  - **Database**: MongoDB (Mongoose 9.6.3).
  - **State Management**: Zustand 5.0.12.
- **Folder / Architecture Structure**:
  - `src/app/`: Core application containing Next.js App Router pages, layouts, and the `api/` directory for backend logic.
  - `src/components/`: Reusable UI components organized by domain (`layout`, `product`, `ui`).
  - `src/lib/`: Core utilities, Mongoose models (`src/lib/models`), database connection logic (`db.ts`), and authentication (`auth.ts`).
  - `src/store/`: Zustand state management stores (`cartStore.ts`, `authStore.ts`, `wishlistStore.ts`, `cursorStore.ts`).
  - `scripts/`: Contains database seeding scripts (`seed.ts`).

## 2. Tech Stack & Infrastructure
- **Frontend Framework**: Next.js (v14.2.35) and React (v18).
- **Database**: MongoDB with Mongoose (v9.6.3).
  - **Schemas / Models**:
    - `Product`: `name`, `slug`, `description`, `shortDescription`, `category`, `brand`, `sku`, `price`, `salePrice`, `onSale`, `stock`, `images` (url, publicId), `colors`, `material`, `dimensions`, `weight`, `isFeatured`, `isNew`, `ratings` (average, count), `reviews`, `tags`.
    - `Order`: `orderId` (e.g., KRV-2026-0001), `user`, `guestInfo`, `items`, `shippingAddress`, `paymentMethod` (COD, JazzCash), `paymentStatus`, `jazzCashTransactionId`, `orderStatus`, `trackingNumber`, `courierName`, `subtotal`, `shippingFee`, `discount`, `total`, `couponCode`, `notes`, `isGift`, `giftMessage`, `placedAt`.
    - `User`: `name`, `email`, `password`, `phone`, `role` (customer, admin), `addresses`, `wishlist`, `refreshToken`, `googleId`, `isVerified`, `verificationToken`, `resetPasswordToken`, `resetPasswordExpire`.
    - `Category`: `name`, `slug`, `image`, `imagePublicId`, `description`, `isActive`.
    - `Bundle`: `name`, `slug`, `description`, `image`, `items` (array of `product` and `quantity`), `bundlePrice`, `isActive`.
    - `Coupon`: `code`, `type` (percent, flat), `value`, `minOrderAmount`, `usageLimit`, `usedCount`, `expiresAt`, `isActive`.
    - `Faq`: `question`, `answer`, `category`, `order`, `isActive`.
    - `Settings`: `freeShippingThreshold`, `shippingFee`, `whatsappNumber`, `storeName`, `contactEmail`.
    - `Testimonial`: `name`, `role`, `text`, `rating`, `image`, `isActive`.
    - `VisitorSession`: Tracks visitor session activity and origin.
    - `AnalyticsEvent`: Tracks specific analytics events (e.g., PageView, AddToCart).
- **Auth System**: Custom JWT implementation (`jsonwebtoken`, `bcryptjs`) along with Google OAuth (`@react-oauth/google`). Auth state is synced to the frontend using Zustand (`authStore.ts`).
- **Hosting / Deployment**: Vercel. Domain managed by Domain.pk.
- **Required Environment Variables**:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD`
  - `NEXT_PUBLIC_SHIPPING_FEE`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CLOUDINARY_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

## 3. Pages & Routes
### Public Routes
- `/`: Home Page. Displays Hero banner, featured products, categories, and promotions.
- `/shop`: Main product listing page. Fetches products with pagination and category filtering.
- `/shop/[slug]`: Product Detail Page (PDP). Displays single product details, images, sizes/colors, and reviews.
- `/cart`: Shopping Cart. Displays selected items, calculates totals, and applies shipping thresholds.
- `/checkout`: Checkout flow. Captures shipping information, payment method selection, and coupon application.
- `/track-order`: Order tracking page. Allows guests/users to input an order ID to view current status.
- `/order-success/[orderId]`: Order confirmation page post-checkout.
- `/coming-soon`: Landing page for upcoming features/collections.
### Auth Routes (Public)
- `/auth/login`, `/auth/register`: Authentication and account creation.
- `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`: Account recovery and verification flows.
### User Routes (Protected)
- `/account`: User Dashboard. Displays profile, addresses, and overview.
- `/account/orders/[id]`: Detailed view of a specific user order.
### Admin Routes (Protected - Admin Only)
- `/admin/dashboard`: High-level metrics, recent orders, low stock warnings.
- `/admin/analytics`: Detailed sales and traffic analytics.
- `/admin/customers`: Customer management list.
- `/admin/orders`: Complete order list with status management filters.
- `/admin/orders/[id]`: Detailed admin order view to update tracking numbers and shipping status.
- `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`: Product catalog management (CRUD).
- `/admin/bundles`: Custom Bundle/Pack management (CRUD).
- `/admin/coupons`: Discount code management.
- `/admin/faqs`: Manage Frequently Asked Questions.
- `/admin/settings`: Global Store Settings (Shipping, WhatsApp, etc.).
- `/admin/testimonials`: Manage customer testimonials.

## 4. Functionalities
- **Product Listing, Filtering, Search**: Fetches data from MongoDB via `/api/products`. Uses URL search params for filtering. Indexed by Mongoose (text index on name, description, tags) for optimal search.
- **Product Detail Page**: Displays multiple product images with `react-slick` carousel. Includes add to cart, wishlist toggle, size guide modal, and a user review section.
- **Cart Logic**: Fully managed client-side using Zustand (`cartStore.ts`) with persistence to `localStorage`. Tracks line items, quantities, subtotal calculation, and auto-applies free shipping if the threshold (`NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD`) is met.
- **Checkout Flow & Order Placement**: 
  - Collects guest or user info and Pakistani province-specific address.
  - Allows Coupon validation via API (`/api/coupons/validate`).
  - Submits order to `/api/orders`, decreasing stock limits atomically on the backend. Generates sequential order IDs (`KRV-YYYY-XXXX`).
- **Payment Integration**: Supports Cash on Delivery (COD) and JazzCash. Stores the `jazzCashTransactionId` directly in the Order model if used.
- **Order Management**: Users can view statuses. Admins can update statuses (placed, confirmed, packed, shipped, delivered, cancelled, returned) and input courier/tracking data.
- **Admin Dashboard Capabilities**: Allows full CRUD on products, categories, coupons, and viewing overarching analytics. Requires `role: "admin"`.
- **User Account/Profile**: Users can manage multiple shipping addresses (setting a default), update passwords, and view order history.
- **Wishlist**: Allows users to save favorite products. Managed via Zustand (`wishlistStore.ts`) and persisted to the `User` model on the backend for logged-in users.
- **Reviews/Ratings**: Integrated directly into the `Product` schema. Recalculates average rating and count on each save via Mongoose pre-save hooks.

## 5. Tracking & Marketing Integrations
- **Meta Pixel**: Initialized in `src/components/MetaPixel.tsx` utilizing Pixel ID `1005576675765836`. Fires a global `PageView` event on route changes (excluding `/admin` and `/api` routes). E-commerce specific events (`AddToCart`, `InitiateCheckout`, `Purchase`) are mapped to respective action handlers using `window.fbq('track', '...')`.
- **Analytics**: Custom internal analytics tracking implemented via `AnalyticsEvent` and `VisitorSession` schemas, logging visitor origins and user behavior internally.
- **SEO Setup**: Standard Next.js `metadata` exports on pages for title/description optimization. Dynamic `sitemap.xml` generated via `src/app/sitemap.ts` and `robots.txt` generated via `src/app/robots.ts` to block crawlers from private routes.

## 6. API Routes
*All routes live under `src/app/api`*
- **Auth**: 
  - `POST /api/auth/[action]`: Handles login, register, verify, google-oauth, forgot-password.
- **Products & Categories**:
  - `GET /api/products`: Fetch product list (with query params for filters).
  - `GET /api/products/[slugOrId]`: Fetch single product by slug or ID.
  - `POST /api/products/[slugOrId]/reviews`: Submit a product review.
  - `GET /api/categories`, `GET /api/categories/[id]`: Fetch active categories.
  - `GET /api/bundles`, `GET /api/bundles/[slug]`: Fetch active product bundles.
- **Orders & Checkout**:
  - `POST /api/orders`: Create a new order (validates stock, applies coupons, calculates final total).
  - `GET /api/orders/my-orders`: Fetch orders for the logged-in user.
  - `GET /api/orders/track`: Public tracking endpoint (looks up order by ID/Phone).
  - `GET /api/orders/[orderId]`: Fetch specific order details.
  - `PUT /api/orders/[orderId]/cancel`: Cancel an order (user action).
- **Coupons**:
  - `GET /api/coupons`, `GET /api/coupons/[id]`: Fetch coupons.
  - `POST /api/coupons/validate`: Verifies if a code is valid, active, and meets the minimum order amount.
- **Admin**:
  - `GET /api/admin/dashboard`, `GET /api/admin/analytics`, `GET /api/admin/analytics/sales`: Fetches aggregated stats for the admin charts.
  - `GET /api/admin/customers`: Fetches user list.
  - `GET/PUT/POST/DELETE /api/admin/orders/*`: Admin order management.
  - `GET/POST/PUT/DELETE /api/admin/bundles/*`: Admin bundle management.
  - `GET/POST/PUT/DELETE /api/admin/faqs/*`: Admin FAQ management.
  - `GET/POST/PUT/DELETE /api/admin/settings/*`: Admin settings management.
  - `GET/POST/PUT/DELETE /api/admin/testimonials/*`: Admin testimonials management.
- **Uploads**:
  - `POST /api/upload`: Handles multipart form data for uploading images directly to Cloudinary.
- **Users**:
  - `GET/POST /api/users/wishlist`, `DELETE /api/users/wishlist/[productId]`: Manage user wishlist state.

## 7. Styling & Design System
- **CSS Approach**: Tailwind CSS coupled with a global stylesheet (`globals.css`).
- **Brand Color Palette** (`tailwind.config.ts`):
  - Primary Background: `#0f0e0c`
  - Secondary Background: `#1a1815`
  - Card Background: `#221f1b`
  - Gold: `#c8a96e` (Light Gold: `#e8c98a`)
  - Cream: `#f0e4ce`
  - Muted text: `#7a6a54`
  - Kaarvan Green: `#2d6a4f`
  - Kaarvan Red: `#8b1a1a`
- **Typography**: 
  - Serif / Headings: `"Space Mono"`, monospace
  - Sans / Body: `"Roboto Mono"`, monospace
- **Animations**: Custom Tailwind animations including `shimmer`, `fadeIn`, and `scaleIn`.
- **Reusable UI Components**: Custom global cursor (`CustomCursor.tsx`, `CursorHover.tsx`), responsive Navbar, unified Footer, `ProductCard`, and modular sections (`HeroSection`, `PromoBanner`, `Testimonials`).

## 8. Known Issues / Technical Debt
- **Codebase Cleanliness**: No critical `TODO` or `FIXME` comments exist in the primary source code. 
- The project recently underwent a major migration, collapsing separate `frontend` and `backend` directories into a unified Next.js App Router Monolith. Legacy directories may still exist locally in developers' environments and should be purged.
- The `google-auth-library` is used, implying Google OAuth is supported, but it requires strict environment variables configuration to operate cleanly without throwing UI errors on the client.

## 9. Environment & Setup Instructions
### Local Setup
1. Clone the repository and ensure you are in the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and populate it with the variables listed in section 2.
4. (Optional) Seed the database with initial products and an admin user:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Deployment
- The application is optimized for deployment on **Vercel**.
- Connect the GitHub repository to a Vercel project, and supply all environment variables in the Vercel Dashboard.
- The domain (`allnone.pk`) can be mapped directly in Vercel's Domains settings.
