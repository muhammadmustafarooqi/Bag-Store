'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';

export default function FaqsPage() {
  const globalSettings = useCartStore((s) => s.globalSettings);
  const WA_NUMBER = globalSettings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';

  const [openId, setOpenId] = useState<string | null>(null);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['public-faqs'],
    queryFn: async () => {
      const { data } = await api.get('/faqs');
      return data.data;
    },
  });

  // Group by category
  const faqsByCategory = faqs?.reduce((acc: any, faq: any) => {
    acc[faq.category] = acc[faq.category] || [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-32 pb-16 px-4" style={{ background: '#0f0e0c' }}>
      <div className="max-w-3xl mx-auto">
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f0e4ce' }} className="text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-center mb-12 text-sm" style={{ color: '#a08060' }}>
          Find answers to common questions about our products, shipping, returns, and more.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : faqs?.length > 0 ? (
          <div className="space-y-12">
            {Object.keys(faqsByCategory).map((category) => (
              <div key={category}>
                <h2 className="text-xl font-serif mb-6" style={{ color: '#c8a96e', borderBottom: '1px solid rgba(200,169,110,0.2)', paddingBottom: '0.5rem' }}>
                  {category}
                </h2>
                <div className="space-y-4">
                  {faqsByCategory[category].map((faq: any) => (
                    <div key={faq._id} style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.1)' }}>
                      <button
                        onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[rgba(200,169,110,0.02)]"
                      >
                        <span className="font-medium pr-4" style={{ color: '#f0e4ce' }}>{faq.question}</span>
                        <span className="text-[#c8a96e] transition-transform duration-300" style={{ transform: openId === faq._id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <FiChevronDown size={20} />
                        </span>
                      </button>
                      <div 
                        className="grid transition-all duration-300 ease-in-out"
                        style={{ gridTemplateRows: openId === faq._id ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          <div className="p-5 pt-0 text-sm leading-relaxed" style={{ color: '#a08060' }}>
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-12" style={{ color: '#7a6a54' }}>No FAQs available at the moment.</p>
        )}
        
        <div className="mt-16 p-8 text-center" style={{ background: '#1a1815', border: '1px dashed rgba(200,169,110,0.2)' }}>
          <h3 className="font-serif text-xl mb-2" style={{ color: '#f0e4ce' }}>Still have questions?</h3>
          <p className="text-sm mb-6" style={{ color: '#7a6a54' }}>Our support team is here to help.</p>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="btn-primary py-3 px-8 inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
