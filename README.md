# KAARVAN 🛍️ — Premium Bag Store for Pakistan

A full-stack e-commerce platform for the Pakistani market, built with Next.js 14, Express.js, MongoDB, Cloudinary, and JazzCash payments.

---

## 🗂️ Project Structure

```
/karwan
  /backend        ← Express.js API server
  /frontend       ← Next.js 14 App Router
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account (for emails)
- Google Cloud account (for OAuth)
- JazzCash merchant account (sandbox for testing)

---

## 🔧 Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_NAME=KAARVAN
FROM_EMAIL=no-reply@kaarvan.pk

# Google OAuth
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Client URLs
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Payments
JAZZCASH_MERCHANT_ID=your_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGRITY_SALT=your_integrity_salt
JAZZCASH_RETURN_URL=http://localhost:5000/api/v1/payments/jazzcash/callback
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start the server
```bash
npm run dev
```

Server runs at: `http://localhost:5000`  
Health check: `http://localhost:5000/health`

---

## 🎨 Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Start development server
```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🛡️ Secure Authentication

The platform now features a professional-grade authentication system:
- **Email Verification**: Mandatory verification for new accounts.
- **Password Reset**: Secure token-based flow for forgotten passwords.
- **Google OAuth**: One-click registration and login.
- **JWT Protection**: Short-lived access tokens with secure refresh tokens.
- **Luxury UI**: Redesigned auth pages with "Classic Luxury" minimalist aesthetics.

---

## ☁️ Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard** → copy Cloud Name, API Key, API Secret
3. Add to backend `.env`
4. Product images upload to folder: `kaarvan/products`

---

## 💳 JazzCash Integration

### Get Sandbox Credentials
1. Visit [sandbox.jazzcash.com.pk](https://sandbox.jazzcash.com.pk)
2. Register as merchant
3. Get: **Merchant ID**, **Password**, **Integrity Salt**
4. Set `JAZZCASH_API_URL=https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/`

### How it works
1. Customer selects JazzCash → frontend calls `/api/v1/payments/jazzcash/initiate`
2. Backend generates HMAC SHA-256 hash with integrity salt
3. Browser submits hidden form to JazzCash URL
4. JazzCash processes and POSTs result to `/api/v1/payments/jazzcash/callback`
5. Backend verifies hash → updates order status → redirects to success/failure page

### For Production
- Change `JAZZCASH_API_URL` to: `https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/`
- Use live merchant credentials

---

## 🗄️ Database Models

| Model | Description |
|-------|-------------|
| **User** | Customers & admins with addresses, wishlist |
| **Product** | Full product info with images, colors, reviews |
| **Order** | Full order lifecycle with COD/JazzCash |
| **Category** | Product categories with Cloudinary images |
| **Coupon** | Percent/flat discount coupons |
| **Banner** | Homepage promotional banners |

---

## 🛣️ API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register & send verification email |
| POST | `/auth/login` | Secure login |
| POST | `/auth/verify-email` | Verify account via token |
| POST | `/auth/forgot-password`| Request reset link |
| POST | `/auth/reset-password` | Set new password via token |
| POST | `/auth/google` | Google OAuth verification |

### Products
| Method | Route | Auth |
|--------|-------|------|
| GET | `/products` | Public |
| GET | `/products/featured` | Public |
| GET | `/products/new-arrivals` | Public |
| GET | `/products/:slug` | Public |
| POST | `/products` | Admin |
| PUT | `/products/:id` | Admin |
| DELETE | `/products/:id` | Admin |
| POST | `/products/:id/reviews` | Customer |

### Orders
| Method | Route | Auth |
|--------|-------|------|
| POST | `/orders` | Public (guest or auth) |
| GET | `/orders/my-orders` | Customer |
| GET | `/orders/:orderId` | Customer/Admin |
| PUT | `/orders/:id/status` | Admin |
| PUT | `/orders/:id/tracking` | Admin |
| POST | `/orders/:id/cancel` | Customer |

---

## 🏗️ Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, products |
| `/shop` | All products with filters |
| `/shop/[slug]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with COD/JazzCash |
| `/order-success/[orderId]` | Order confirmation |
| `/account` | User profile, orders, wishlist |
| `/auth/login` | Luxury Login page |
| `/auth/register` | Luxury Joining page |
| `/auth/verify-email` | Email verification handler |
| `/auth/forgot-password`| Reset request form |
| `/auth/reset-password` | New password form |
| `/admin/dashboard` | Admin stats & charts |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |

---

## 🎨 Design System

- **Font Display**: Cormorant Garamond (serif, elegant)
- **Font UI**: Outfit (clean, modern)
- **Primary Background**: `#050505` (Deep luxury black)
- **Gold Accent**: `#c8a96e`
- **Cream Text**: `#f0e4ce`

---

## 🇵🇰 Pakistan-Specific Features

- ✅ All prices in **Pakistani Rupees (Rs)**
- ✅ **Cash on Delivery** (COD) default
- ✅ **JazzCash** Wallet integration
- ✅ Pakistani phone validation (`03XXXXXXXXX`)
- ✅ All **provinces & major cities**
- ✅ **WhatsApp** floating support

---

## 🚀 Production Deployment

### Backend (e.g., Railway, Render, VPS)
```bash
NODE_ENV=production npm start
```

### Frontend (Vercel)
```bash
cd frontend
npx vercel --prod
```

Set environment variables in Vercel dashboard.

---

## 📝 Admin Access

After seeding the database:
- **Email**: `admin@kaarvan.pk`
- **Password**: `Admin@1234`

Navigate to `/admin/dashboard` after login.

---

## 🤝 Support

For business inquiries, contact: **hello@kaarvan.pk**  
WhatsApp: **0300-1234567**
