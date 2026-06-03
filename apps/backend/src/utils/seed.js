require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Product, Category, connectDB } = require('@kaarvan/db');

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

  const baseImages = [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
    'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=800',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800',
    'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800',
    'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800',
    'https://images.unsplash.com/photo-1575037614876-c385ec8bbd54?w=800'
  ];

  const categoryNames = ['handbag', 'backpack', 'laptop bag', 'tote', 'travel bag', 'clutch', 'wallet', 'school bag'];
  const adjectives = ['Luxe', 'Urban', 'Classic', 'Vintage', 'Modern', 'Premium', 'Minimalist', 'Boho', 'Chic', 'Signature', 'Everyday', 'Essential', 'Compact', 'Spacious', 'Sleek'];
  const materials = ['Leather', 'Canvas', 'Nylon', 'Vegan Leather', 'Suede', 'Velvet', 'Cotton', 'Polyester'];
  const allColors = ['Black', 'Brown', 'Tan', 'Navy', 'Beige', 'White', 'Red', 'Olive', 'Burgundy'];

  const generatedProducts = [];
  for (let i = 0; i < 45; i++) {
    const category = categoryNames[i % categoryNames.length];
    const adjective = adjectives[i % adjectives.length];
    const material = materials[i % materials.length];
    const capCat = category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const name = `${adjective} ${material} ${capCat}`;
    const price = Math.floor(Math.random() * 8000) + 2000;
    const hasSale = Math.random() > 0.7;
    const shuffledColors = [...allColors].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    generatedProducts.push({
      name: `${name} ${i+1}`,
      slug: `${name.toLowerCase().replace(/ /g, '-')}-${i+1}`,
      description: `Experience the perfect blend of style and functionality with our ${name}. Crafted from high-quality ${material.toLowerCase()}, it offers durability and a sophisticated look for any occasion.`,
      shortDescription: `High-quality ${material.toLowerCase()} ${category}`,
      category,
      brand: 'KAARVAN',
      sku: `KRV-${category.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}-${i}`,
      price,
      salePrice: hasSale ? Math.floor(price * 0.8) : undefined,
      onSale: hasSale,
      stock: Math.floor(Math.random() * 50) + 10,
      images: [
        { url: baseImages[i % baseImages.length], publicId: `kaarvan/products/${category}${i}-1` },
        { url: baseImages[(i + 1) % baseImages.length], publicId: `kaarvan/products/${category}${i}-2` },
        { url: baseImages[(i + 2) % baseImages.length], publicId: `kaarvan/products/${category}${i}-3` },
        { url: baseImages[(i + 3) % baseImages.length], publicId: `kaarvan/products/${category}${i}-4` },
      ],
      colors: shuffledColors,
      material,
      dimensions: '30cm x 22cm x 12cm',
      weight: '0.8kg',
      isFeatured: Math.random() > 0.8,
      isNew: Math.random() > 0.7,
      tags: [category.replace(' ', '-'), material.toLowerCase(), 'fashion'],
    });
  }

  const products = await Product.insertMany(generatedProducts);
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
