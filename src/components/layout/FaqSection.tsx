'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['public-faqs-home'],
    queryFn: async () => {
      const { data } = await api.get('/faqs');
      return data.data;
    },
  });

  if (isLoading || !faqs || faqs.length === 0) return null;

  // Take only first 4-5 FAQs for the home page, or just top 5.
  const displayFaqs = faqs.slice(0, 5);

  return (
    <section className="py-24" style={{ background: '#0a0908', borderTop: '1px solid rgba(200,169,110,0.1)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="section-subtitle mb-2">Got Questions?</p>
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f0e4ce' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq: any) => (
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

        <div className="text-center mt-12">
          <Link href="/faqs" className="btn-outline px-8 py-3">
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}
