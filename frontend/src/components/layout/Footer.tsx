import Link from 'next/link';
import { FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

export function Footer() {
  return (
    <footer style={{ background: '#0a0908', borderTop: '1px solid rgba(200,169,110,0.15)' }}>
      {/* Newsletter Strip */}
      <div style={{ background: '#1a1815', borderBottom: '1px solid rgba(200,169,110,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-subtitle mb-1">Stay in the loop</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', color: '#f0e4ce' }}>
              Subscribe for Exclusive Offers
            </h3>
          </div>
          <form className="flex w-full md:w-auto gap-0" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="input-field w-full md:w-72"
            />
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/">
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '0.2em', color: '#c8a96e' }}>
                KAARVAN
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#7a6a54' }}>
              Premium bags crafted for the modern Pakistani lifestyle. Quality you can feel, style you can trust.
            </p>
            <div className="flex gap-4 mt-6">
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(200,169,110,0.1)', color: '#c8a96e' }}>
                <FaWhatsapp size={18} />
              </a>
              <a href="https://instagram.com/kaarvan.pk" target="_blank" rel="noreferrer"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(200,169,110,0.1)', color: '#c8a96e' }}>
                <FiInstagram size={18} />
              </a>
              <a href="https://facebook.com/kaarvan" target="_blank" rel="noreferrer"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(200,169,110,0.1)', color: '#c8a96e' }}>
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#c8a96e' }}>Shop</h4>
            <ul className="space-y-3">
              {['Handbags', 'Backpacks', 'Laptop Bags', 'Tote Bags', 'Travel Bags', 'Clutches', 'Wallets', 'School Bags'].map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${encodeURIComponent(cat.toLowerCase())}`}
                    className="text-sm transition-colors duration-200 hover:text-[#c8a96e]"
                    style={{ color: '#7a6a54' }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#c8a96e' }}>Information</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/shipping-policy', label: 'Shipping Policy' },
                { href: '/return-policy', label: 'Return Policy' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors duration-200 hover:text-[#c8a96e]" style={{ color: '#7a6a54' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#c8a96e' }}>Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm" style={{ color: '#7a6a54' }}>
                <FiPhone size={16} className="mt-0.5 flex-shrink-0 text-[#c8a96e]" />
                <a href="tel:+923001234567" className="hover:text-[#c8a96e] transition-colors">0300-1234567</a>
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: '#7a6a54' }}>
                <FiMail size={16} className="mt-0.5 flex-shrink-0 text-[#c8a96e]" />
                <a href="mailto:hello@kaarvan.pk" className="hover:text-[#c8a96e] transition-colors">hello@kaarvan.pk</a>
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: '#7a6a54' }}>
                <FiMapPin size={16} className="mt-0.5 flex-shrink-0 text-[#c8a96e]" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
            <div className="mt-6 p-4 text-xs" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <p style={{ color: '#7a6a54' }}>Mon – Sat: 10am – 8pm</p>
              <p style={{ color: '#7a6a54' }}>Sun: 12pm – 6pm</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '✦', title: '100% Original', desc: 'Authentic products only' },
              { icon: '↩', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: 'JazzCash & COD' },
              { icon: '🚚', title: 'Nationwide Delivery', desc: 'All cities in Pakistan' },
            ].map((b) => (
              <div key={b.title} className="py-4">
                <div className="text-2xl mb-2">{b.icon}</div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#c8a96e' }}>{b.title}</p>
                <p className="text-xs" style={{ color: '#7a6a54' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
          <p className="text-xs" style={{ color: '#7a6a54' }}>
            © {new Date().getFullYear()} KAARVAN. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: '#7a6a54' }}>
            Made with ♥ in Pakistan 🇵🇰
          </p>
        </div>
      </div>
    </footer>
  );
}
