export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Review {
  _id: string;
  userId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand: string;
  sku?: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  stock: number;
  images: ProductImage[];
  colors: string[];
  material?: string;
  dimensions?: string;
  weight?: string;
  isFeatured: boolean;
  isNew: boolean;
  ratings: { average: number; count: number };
  reviews: Review[];
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  qty: number;
  color: string;
  price: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[];
}

export interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  province: string;
  isDefault: boolean;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user?: string;
  guestInfo?: { name: string; email: string; phone: string };
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    province: string;
  };
  paymentMethod: 'COD' | 'JazzCash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: string;
  trackingNumber?: string;
  courierName?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  placedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
