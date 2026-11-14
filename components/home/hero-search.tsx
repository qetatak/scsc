'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpLeft } from 'lucide-react';
import { LABS_METADATA } from '@/data/mock-data';
import { Button } from '@/components/ui/button';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('/labs');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (selectedRoute !== '/labs') {
      router.push(selectedRoute);
      return;
    }
    if (q.includes('محاسب') || q.includes('ميزان') || q.includes('قيد')) {
      router.push('/labs/accounting');
    } else if (q.includes('تسويق') || q.includes('roi') || q.includes('حمل')) {
      router.push('/labs/marketing');
    } else if (q.includes('إدار') || q.includes('swot') || q.includes('تعادل')) {
      router.push('/labs/management');
    } else if (q.includes('برمج') || q.includes('python') || q.includes('بايثون')) {
      router.push('/labs/python');
    } else {
      router.push('/labs');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      aria-label="ابحث عن مختبر أو مهارة"
      className="mt-7 w-full max-w-2xl"
    >
      <div className="flex flex-col gap-2 rounded-[16px] border border-[#E3E8F0] bg-white p-2.5 sm:flex-row sm:items-center dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="relative flex min-h-[46px] flex-1 items-center">
          <Search className="pointer-events-none mr-3 h-4 w-4 shrink-0 stroke-[1.5] text-[#526077] dark:text-[#94A3B8]" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="ابحث عن مختبر أو مهارة"
            placeholder="ابحث عن مختبر أو مهارة..."
            className="h-11 w-full bg-transparent px-2 text-base sm:text-sm text-[#0A1630] placeholder:text-[#526077]/65 focus:outline-none dark:text-[#FAFBFC] dark:placeholder:text-[#94A3B8]/70"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            aria-label="اختر المختبر التفاعلي"
            className="min-h-[44px] rounded-[10px] border border-[#E3E8F0] bg-[#F1F4F9] px-3 text-base sm:text-xs font-medium text-[#0A1630] focus:border-[#2F6BFF] focus:outline-none dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
          >
            <option value="/labs">جميع المختبرات</option>
            {LABS_METADATA.map((lab) => (
              <option key={lab.id} value={lab.slug}>
                {lab.title}
              </option>
            ))}
          </select>

          <Button type="submit" className="min-h-[46px] shrink-0 px-5">
            <span>ابدأ التدريب</span>
            <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
          </Button>
        </div>
      </div>
    </form>
  );
}
