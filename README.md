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
MONGO_URI=mongodb://localhost:27017/kaarvan
JWT_SECRET=your_very_long_secret_here
JWT_REFRESH_SECRET=another_very_long_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JAZZCASH_MERCHANT_ID=your_merchant_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGRITY_SALT=your_integrity_salt
JAZZCASH_RETURN_URL=http://localhost:5000/api/v1/payments/jazzcash/callback
CLIENT_URL=http://localhost:3000
```

### 3. Seed the database
```bash
npm run seed
```
This creates:
- Admin account: `admin@kaarvan.pk` / `Admin@1234`
- 8 product categories
- 5 sample products

### 4. Start the server
```bash
npm run dev   # Development (nodemon)
npm start     # Production
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
```

### 3. Start development server
```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

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
| Method | Route | Auth |
|--------|-------|------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/logout` | Public |
| POST | `/auth/refresh-token` | Public |
| GET | `/auth/me` | Required |

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
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/admin/dashboard` | Admin stats & charts |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |

---

## 🎨 Design System

- **Font Display**: Cormorant Garamond (serif, elegant)
- **Font UI**: Outfit (clean, modern)
- **Primary Background**: `#0f0e0c` (very dark warm black)
- **Gold Accent**: `#c8a96e`
- **Cream Text**: `#f0e4ce`
- **Green (Success)**: `#2d6a4f`

---

## 🇵🇰 Pakistan-Specific Features

- ✅ All prices in **Pakistani Rupees (Rs)**
- ✅ **Cash on Delivery** (COD) is default payment method
- ✅ **JazzCash** Mobile Wallet integration
- ✅ Pakistani phone number validation (`03XXXXXXXXX`)
- ✅ All major **Pakistani cities** in dropdowns
- ✅ All **provinces** (Punjab, Sindh, KPK, Balochistan, AJK, GB, Islamabad)
- ✅ Free shipping threshold: **Rs 2,000**
- ✅ **WhatsApp** floating contact button
- ✅ Delivery estimate: **3-7 business days**
- ✅ Auto-generated Order IDs: **KRV-2025-0001**

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
