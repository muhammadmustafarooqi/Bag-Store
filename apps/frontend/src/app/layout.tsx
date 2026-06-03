import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: {
    default: "KAARVAN — Premium Bags for Pakistan",
    template: "%s | KAARVAN",
  },
  description:
    "Shop premium handbags, backpacks, laptop bags, totes, clutches and more. Pakistan-wide delivery. Cash on Delivery available.",
  keywords: 'bags pakistan, handbags, backpacks, laptop bags, karachi bags, lahore bags, online shopping pakistan',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://kaarvan.pk',
    siteName: 'KAARVAN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CustomCursor />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
