'use client';
import { FaWhatsapp } from 'react-icons/fa';
import { fbEvent } from '@/lib/pixel';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export function WhatsAppButton() {
  const pathname = usePathname();
  const globalSettings = useCartStore((state) => state.globalSettings);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const WA_NUMBER = globalSettings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=Hi%20KAARVAN!%20I%20need%20help%20with%20my%20order.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => fbEvent('Contact')}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
      style={{ background: '#25d366', color: '#fff' }}
    >
      <FaWhatsapp size={28} />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping" style={{ background: '#25d366', opacity: 0.6 }} />
    </a>
  );
}
