require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const seed = async () => {
  await connectDB();

  // Clear existing
  await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // Admin user
  const admin = await User.create({
    name: 'KAARVAN Admin',
    email: 'admin@kaarvan.pk',
    password: 'Admin@1234',
    phone: '03001234567',
    role: 'admin',
  });
  console.log('✅ Admin created:', admin.email);

  // Categories
  const categories = await Category.insertMany([
    { name: 'Handbag', slug: 'handbag', description: 'Elegant everyday handbags', isActive: true },
    { name: 'Backpack', slug: 'backpack', description: 'Stylish and functional backpacks', isActive: true },
    { name: 'Laptop Bag', slug: 'laptop-bag', description: 'Professional laptop bags', isActive: true },
    { name: 'Tote', slug: 'tote', description: 'Spacious tote bags', isActive: true },
    { name: 'Travel Bag', slug: 'travel-bag', description: 'Durable travel bags', isActive: true },
    { name: 'Clutch', slug: 'clutch', description: 'Elegant clutches for special occasions', isActive: true },
    { name: 'Wallet', slug: 'wallet', description: 'Premium leather wallets', isActive: true },
    { name: 'School Bag', slug: 'school-bag', description: 'Comfortable school bags for kids', isActive: true },
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // Sample products
  const products = await Product.insertMany([
    {
      name: 'Luxe Leather Handbag',
      slug: 'luxe-leather-handbag',
      description: 'A premium full-grain leather handbag with gold-tone hardware. Perfect for daily use or special occasions.',
      shortDescription: 'Premium full-grain leather with gold hardware',
      category: 'handbag',
      brand: 'KAARVAN',
      sku: 'KRV-HB-001',
      price: 8500,
      salePrice: 6999,
      onSale: true,
      stock: 25,
      images: [
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', publicId: 'kaarvan/products/handbag1' },
      ],
      colors: ['Black', 'Tan', 'Burgundy'],
      material: 'Full-grain leather',
      dimensions: '30cm x 22cm x 12cm',
      weight: '0.8kg',
      isFeatured: true,
      isNew: false,
      tags: ['leather', 'handbag', 'luxury', 'women'],
    },
    {
      name: 'Urban Explorer Backpack',
      slug: 'urban-explorer-backpack',
      description: 'Water-resistant 30L backpack with padded laptop compartment. Ideal for work, travel, and everyday adventures.',
      shortDescription: 'Water-resistant 30L with padded laptop compartment',
      category: 'backpack',
      brand: 'KAARVAN',
      sku: 'KRV-BP-001',
      price: 5500,
      stock: 40,
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', publicId: 'kaarvan/products/backpack1' },
      ],
      colors: ['Black', 'Navy', 'Olive'],
      material: 'Polyester 600D',
      dimensions: '45cm x 30cm x 15cm',
      weight: '0.6kg',
      isFeatured: true,
      isNew: true,
      tags: ['backpack', 'travel', 'laptop', 'waterproof'],
    },
    {
      name: 'Executive Laptop Bag',
      slug: 'executive-laptop-bag',
      description: 'Sleek briefcase-style laptop bag for 15.6" laptops. Multiple compartments for organized professional life.',
      shortDescription: 'Fits 15.6" laptops with organized compartments',
      category: 'laptop bag',
      brand: 'KAARVAN',
      sku: 'KRV-LB-001',
      price: 6200,
      salePrice: 4999,
      onSale: true,
      stock: 15,
      images: [
        { url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800', publicId: 'kaarvan/products/laptop1' },
      ],
      colors: ['Black', 'Dark Brown'],
      material: 'PU Leather',
      dimensions: '40cm x 30cm x 8cm',
      weight: '0.7kg',
      isFeatured: true,
      isNew: false,
      tags: ['laptop', 'office', 'professional', 'briefcase'],
    },
    {
      name: 'Classic Canvas Tote',
      slug: 'classic-canvas-tote',
      description: 'Spacious canvas tote with reinforced handles. Perfect for shopping, beach days, or casual outings.',
      shortDescription: 'Large spacious canvas with reinforced handles',
      category: 'tote',
      brand: 'KAARVAN',
      sku: 'KRV-TT-001',
      price: 2200,
      stock: 60,
      images: [
        { url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800', publicId: 'kaarvan/products/tote1' },
      ],
      colors: ['Beige', 'White', 'Black', 'Olive'],
      material: 'Canvas',
      dimensions: '40cm x 35cm x 12cm',
      weight: '0.3kg',
      isFeatured: false,
      isNew: true,
      tags: ['tote', 'canvas', 'casual', 'shopping'],
    },
    {
      name: 'Velvet Evening Clutch',
      slug: 'velvet-evening-clutch',
      description: 'Luxurious velvet clutch with crystal clasp closure. The perfect statement piece for weddings and formal events.',
      shortDescription: 'Velvet with crystal clasp, perfect for formal events',
      category: 'clutch',
      brand: 'KAARVAN',
      sku: 'KRV-CL-001',
      price: 3500,
      stock: 20,
      images: [
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', publicId: 'kaarvan/products/clutch1' },
      ],
      colors: ['Royal Blue', 'Wine Red', 'Emerald', 'Black'],
      material: 'Velvet with satin lining',
      dimensions: '22cm x 12cm x 5cm',
      weight: '0.2kg',
      isFeatured: true,
      isNew: true,
      tags: ['clutch', 'formal', 'wedding', 'evening'],
    },
  ]);
  console.log(`✅ ${products.length} products created`);

  console.log('\n🎉 Seed complete!');
  console.log('Admin credentials:');
  console.log('  Email: admin@kaarvan.pk');
  console.log('  Password: Admin@1234');

  mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed error:', err);
  mongoose.disconnect();
  process.exit(1);
});
