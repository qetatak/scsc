'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const updateProgress = () => {
      if (!progressBarRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    };

    // Preserve 100% native OS inertial touch scrolling on smartphones & tablets
    if (prefersReducedMotion || isCoarsePointer) {
      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
      return () => {
        window.removeEventListener('scroll', updateProgress);
      };
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', () => {
      updateProgress();
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    updateProgress();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-right bg-[#2F6BFF] transition-transform duration-75 ease-out"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      {children}
    </>
  );
}
