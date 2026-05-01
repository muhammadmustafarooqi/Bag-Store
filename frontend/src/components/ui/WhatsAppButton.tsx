'use client';
import { FaWhatsapp } from 'react-icons/fa';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=Hi%20KAARVAN!%20I%20need%20help%20with%20my%20order.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
      style={{ background: '#25d366', color: '#fff' }}
    >
      <FaWhatsapp size={28} />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping" style={{ background: '#25d366', opacity: 0.6 }} />
    </a>
  );
}
