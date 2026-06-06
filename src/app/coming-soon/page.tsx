import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#0f0e0c' }}>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ fontFamily: "'Space Mono', monospace", color: '#c8a96e' }}>
        Coming Soon
      </h1>
      <p className="mb-8 text-center" style={{ color: '#7a6a54' }}>
        This page is currently under construction. Check back later!
      </p>
      <Link href="/" className="btn-primary px-8 py-3">
        Return to Home
      </Link>
    </div>
  );
}
