import type { Metadata } from 'next';
import { HeroSection } from '@/components/layout/HeroSection';
import { CategoryGrid } from '@/components/layout/CategoryGrid';
import { FeaturedProducts } from '@/components/layout/FeaturedProducts';
import { NewArrivals } from '@/components/layout/NewArrivals';
import { WhyChooseUs } from '@/components/layout/WhyChooseUs';
import { PromoBanner } from '@/components/layout/PromoBanner';
import { MysteryVault } from '@/components/MysteryVault';
import { Testimonials } from '@/components/layout/Testimonials';
import { FaqSection } from '@/components/layout/FaqSection';

export const metadata: Metadata = {
  title: 'KAARVAN — Premium Bags for Pakistan',
  description: 'Shop premium handbags, backpacks, laptop bags, and more. Pakistan-wide delivery. Cash on Delivery available.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <MysteryVault />
      <NewArrivals />
      <WhyChooseUs />
      <FaqSection />
      <Testimonials />
    </>
  );
}
