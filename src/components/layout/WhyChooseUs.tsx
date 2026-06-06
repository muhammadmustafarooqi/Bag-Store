import { 
  MdOutlineWorkspacePremium,
  MdOutlineKeyboardReturn,
  MdOutlinePayments,
  MdOutlineLocalShipping
} from 'react-icons/md';
import { CursorHover } from '@/components/ui/CursorHover';

const FEATURES = [
  {
    Icon: MdOutlineWorkspacePremium,
    title: '100% Original Products',
    desc: 'Every bag is genuine and quality-checked before shipping.',
    cursorTitle: '100% Legit 💯',
    cursorSubtitle: 'No knock-offs here'
  },
  {
    Icon: MdOutlineKeyboardReturn,
    title: 'Easy 7-Day Returns',
    desc: 'Not satisfied? Return within 7 days, no questions asked.',
    cursorTitle: 'No Stress 😌',
    cursorSubtitle: 'Easy returns'
  },
  {
    Icon: MdOutlinePayments,
    title: 'Cash on Delivery',
    desc: 'Pay when you receive. Safe, convenient, trusted by thousands.',
    cursorTitle: 'COD Available 💰',
    cursorSubtitle: 'Pay at your door'
  },
  {
    Icon: MdOutlineLocalShipping,
    title: 'Fast Nationwide Shipping',
    desc: 'Delivery to all cities in Pakistan in 3–7 business days.',
    cursorTitle: 'Zoom Zoom 🚀',
    cursorSubtitle: 'Right to your door'
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 px-4" style={{ background: '#0a0907' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#c8a96e' }}>Our Promise</p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce' }}>
            Why Choose KAARVAN?
          </h2>
          <div className="w-16 h-px mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, #c8a96e, transparent)' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              <CursorHover title={f.cursorTitle} subtitle={f.cursorSubtitle} icon="✨" className="w-full flex flex-col items-center">
              {/* Floating Icon Container */}
              <div 
                className="relative w-20 h-20 rounded-full flex items-center justify-center mb-8 transition-all duration-500 group-hover:-translate-y-3"
                style={{ 
                  background: 'radial-gradient(circle at top left, #1a1815 0%, #0f0e0c 100%)',
                  border: '1px solid rgba(200,169,110,0.08)',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                }}
              >
                {/* Subtle Glow Behind Icon on Hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: 'rgba(200,169,110,0.1)' }} />
                
                <div className="relative text-3xl transition-transform duration-500 group-hover:scale-110" style={{ color: '#c8a96e' }}>
                  <f.Icon />
                </div>
              </div>
              
              <h3
                style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce' }}
                className="text-xl md:text-2xl font-light mb-4 group-hover:text-[#c8a96e] transition-colors duration-300"
              >
                {f.title}
              </h3>
              <p className="text-[11px] uppercase tracking-[0.1em] leading-relaxed max-w-xs mx-auto" style={{ color: '#7a6a54' }}>
                {f.desc}
              </p>
              </CursorHover>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
