import { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://allnone.pk';
  
  await connectDB();
  
  const products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();
  const categories = await Category.find({ isActive: true }, { slug: 1, updatedAt: 1 }).lean();

  const productEntries: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/shop?category=${category.slug}`,
    lastModified: category.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
