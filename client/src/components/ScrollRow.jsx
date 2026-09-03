import { useRef } from 'react';

// A simple horizontally-scrolling row with two arrow buttons. Used for the
// specialty/doctor/hospital "carousels" on the homepage — plain scroll
// behavior under the hood, no carousel library needed.
export default function ScrollRow({ children }) {
  const trackRef = useRef(null);

  function scroll(direction) {
    trackRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <div ref={trackRef} className="no-scrollbar flex gap-space-lg overflow-x-auto scroll-smooth pb-space-xs">
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute top-1/2 left-0 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-lowest p-space-xs text-primary shadow-sm transition-colors hover:bg-primary hover:text-on-primary sm:flex"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute top-1/2 right-0 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-lowest p-space-xs text-primary shadow-sm transition-colors hover:bg-primary hover:text-on-primary sm:flex"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
