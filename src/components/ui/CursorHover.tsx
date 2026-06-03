'use client';

import { useCursorStore } from '@/store/cursorStore';

interface CursorHoverProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon?: string;
  className?: string;
}

export function CursorHover({ children, title, subtitle, icon, className = '' }: CursorHoverProps) {
  const { setCursor, resetCursor } = useCursorStore();

  return (
    <div
      className={`inline-block ${className}`}
      onMouseEnter={() => setCursor(title, subtitle, icon || '✨')}
      onMouseLeave={resetCursor}
    >
      {children}
    </div>
  );
}
