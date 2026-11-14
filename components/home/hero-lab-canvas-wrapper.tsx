'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Code2, TrendingUp, CheckCircle2, Layers } from 'lucide-react';

const HeroLabScene3D = dynamic(
  () => import('@/components/home/hero-lab-scene-3d'),
  {
    ssr: false,
  }
);

function LightweightArchitecturalPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[16px] bg-[#0A1630] p-5 text-[#FAFBFC]"
    >
      <div className="flex items-center justify-between border-b border-[#1E325C] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#2F6BFF]/15 text-[#2F6BFF]">
            <Layers className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#FAFBFC]">شركة تدريبك الافتراضية</p>
            <p className="font-tabular text-[11px] text-[#94A3B8]">4 INTERACTIVE LABS</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-[8px] border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-1 font-tabular text-[11px] font-medium text-[#22C55E]">
          <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.75]" />
          <span>BALANCED</span>
        </span>
      </div>

      {/* Layered Cards Visualization */}
      <div className="my-4 space-y-2.5">
        <div className="rounded-[12px] border border-[#1E325C] bg-[#070D1F] p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">معادلة الميزانية الحية</span>
            <span className="font-tabular font-semibold text-[#2F6BFF]">65,000 JOD</span>
          </div>
          <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-[#1E325C]">
            <div className="h-full w-[77%] bg-[#2F6BFF]" />
            <div className="h-full w-[23%] bg-[#94A3B8]/50" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[12px] border border-[#1E325C] bg-[#070D1F] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8]">العائد ROI</span>
              <TrendingUp className="h-3.5 w-3.5 stroke-[1.5] text-[#22C55E]" />
            </div>
            <p className="mt-1 font-tabular text-base font-semibold text-[#FAFBFC]">
              +184%
            </p>
          </div>

          <div className="rounded-[12px] border border-[#1E325C] bg-[#070D1F] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8]">Python Lab</span>
              <Code2 className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
            </div>
            <p className="mt-1 font-tabular text-base font-semibold text-[#2F6BFF]">
              PASS · 5/5
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#1E325C] pt-3 font-tabular text-[11px] text-[#94A3B8]">
        <span>SIMULATION ENGINE</span>
        <span className="text-[#2F6BFF]">LIVE STATE SYNC</span>
      </div>
    </div>
  );
}

export function HeroLabCanvasWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldMount3D, setShouldMount3D] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    // Never mount 3D WebGL scene on smartphones (< 768px)
    const isSmallScreen = window.innerWidth < 768;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const saveData = Boolean(nav.connection?.saveData);
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4;

    if (prefersReduced || isSmallScreen || saveData || lowMemory) {
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldMount3D(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[300px] w-full overflow-hidden rounded-[16px] border border-[#E3E8F0] bg-[#0A1630] sm:h-[380px] md:h-[420px] dark:border-[#1E325C]"
    >
      <div className="absolute inset-0">
        <LightweightArchitecturalPreview />
      </div>

      {shouldMount3D && (
        <div className="relative z-10 h-full w-full">
          <HeroLabScene3D />
        </div>
      )}
    </div>
  );
}
