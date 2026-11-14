'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Circle,
  Search,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  Inbox,
  SlidersHorizontal,
} from 'lucide-react';
import { OnboardingChecklistItem } from '@/data/dashboard-mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { cn } from '@/lib/utils';

// 1. PageHeader
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 border-b border-[#E3E8F0] pb-4 sm:mb-6 sm:flex-row sm:items-center sm:pb-5 dark:border-[#1E325C]">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#526077] dark:text-[#94A3B8]">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

// 2. DashboardStatCard
export function DashboardStatCard({
  label,
  value,
  changeText,
  changeTone = 'positive',
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  changeText: string;
  changeTone?: 'positive' | 'neutral';
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
          {label}
        </span>
        {Icon && (
          <Icon className="h-4 w-4 stroke-[1.5] text-[#526077] dark:text-[#94A3B8]" />
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2 sm:mt-3">
        <span className="font-tabular text-2xl font-semibold text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
          {value}
        </span>
        <span
          className={cn(
            'font-tabular text-xs font-medium',
            changeTone === 'positive'
              ? 'text-[#2F6BFF]'
              : 'text-[#526077] dark:text-[#94A3B8]'
          )}
        >
          {changeText}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-[#526077] dark:text-[#94A3B8]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// 3. ChecklistCard
export function ChecklistCard({
  title,
  subtitle,
  items,
  onToggleStep,
}: {
  title: string;
  subtitle: string;
  items: OnboardingChecklistItem[];
  onToggleStep: (id: string) => void;
}) {
  const completedCount = items.filter((i) => i.completed).length;
  const allCompleted = completedCount === items.length;

  if (allCompleted) {
    return null;
  }

  const progressPct = Math.round((completedCount / items.length) * 100);

  return (
    <section
      aria-label={title}
      className="mb-6 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-[#E3E8F0] pb-4 sm:flex-row sm:items-center dark:border-[#1E325C]">
        <div>
          <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-tabular text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
            {completedCount} من {items.length} مكتمل ({progressPct}%)
          </span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#F1F4F9] dark:bg-[#070D1F]">
            <div
              className="h-full bg-[#2F6BFF] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((step) => (
          <div
            key={step.id}
            className={cn(
              'flex flex-col justify-between rounded-[12px] border p-4 transition-colors',
              step.completed
                ? 'border-[#E3E8F0] bg-[#FAFBFC] dark:border-[#1E325C] dark:bg-[#070D1F]'
                : 'border-[#E3E8F0] bg-white hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]'
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStep(step.id)}
                  aria-label={`تبديل حالة: ${step.title}`}
                  className="inline-flex min-h-[38px] items-center gap-2 text-right"
                >
                  {step.completed ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E] text-white">
                      <Check className="h-3 w-3 stroke-[2]" />
                    </span>
                  ) : (
                    <Circle className="h-5 w-5 stroke-[1.5] text-[#526077] dark:text-[#94A3B8]" />
                  )}
                  <span className="text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
                    {step.completed ? 'مكتملة' : 'غير مكتملة'}
                  </span>
                </button>
              </div>

              <h3
                className={cn(
                  'mt-2.5 text-sm font-medium',
                  step.completed
                    ? 'text-[#526077] line-through dark:text-[#94A3B8]'
                    : 'text-[#0A1630] dark:text-[#FAFBFC]'
                )}
              >
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                {step.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 pt-2">
              <Link href={step.href} className="w-full">
                <Button
                  type="button"
                  variant={step.completed ? 'secondary' : 'default'}
                  size="sm"
                  className="w-full text-xs"
                >
                  {step.actionLabel}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 4. ChartCard
export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]',
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 sm:mb-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="w-full min-w-0 sm:w-auto">{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

// 5. EmptyState
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#E3E8F0] bg-white px-6 py-12 text-center dark:border-[#1E325C] dark:bg-[#0A1630]">
      <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] text-[#526077] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#94A3B8]">
        <Inbox className="h-5 w-5 stroke-[1.5]" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
        {description}
      </p>
      {actionLabel && (
        <div className="mt-4">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="sm">{actionLabel}</Button>
            </Link>
          ) : (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// 6. DashboardSkeleton
export function DashboardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="جاري التحميل">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="h-14 w-full animate-pulse rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] dark:border-[#1E325C] dark:bg-[#0A1630]"
        />
      ))}
    </div>
  );
}

// 7. DataTable (Mobile Native Card Stack + Vaul Filter/Sort Sheet < md, Sortable Table >= md)
export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  searchPlaceholder = 'ابحث...',
  searchMatcher,
  pageSize = 5,
  emptyTitle = 'لا توجد سجلات مطابقة',
  emptyDescription = 'جرب تعديل كلمات البحث أو الفلاتر لعرض النتائج.',
}: {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  searchMatcher?: (row: T, query: string) => boolean;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const sortableColumns = useMemo(
    () => columns.filter((c) => c.sortable && c.sortValue),
    [columns]
  );

  const filteredData = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    let list = data;
    if (trimmed && searchMatcher) {
      list = list.filter((row) => searchMatcher(row, trimmed));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col && col.sortValue) {
        const getter = col.sortValue;
        list = [...list].sort((a, b) => {
          const va = getter(a);
          const vb = getter(b);
          if (typeof va === 'number' && typeof vb === 'number') {
            return sortDir === 'asc' ? va - vb : vb - va;
          }
          return sortDir === 'asc'
            ? String(va).localeCompare(String(vb), 'ar')
            : String(vb).localeCompare(String(va), 'ar');
        });
      }
    }
    return list;
  }, [data, query, searchMatcher, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredData.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const primaryCol = columns[0];
  const secondaryCols = columns.slice(1);
  const hasTools = Boolean(searchMatcher) || sortableColumns.length > 0;

  return (
    <div className="space-y-4">
      {hasTools && (
        <>
          {/* Mobile Toolbar (< md): Opens Vaul Bottom Sheet for Search & Sort */}
          <div className="flex items-center justify-between gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              className="min-h-[44px] gap-2"
            >
              <SlidersHorizontal className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
              <span>بحث وفرز</span>
              {(query.trim() || sortKey) && (
                <span className="h-2 w-2 rounded-full bg-[#2F6BFF]" />
              )}
            </Button>
            <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
              {filteredData.length} نتيجة
            </span>
          </div>

          {/* Desktop/Tablet Inline Search Bar (>= md) */}
          {searchMatcher && (
            <div className="hidden items-center justify-between gap-3 md:flex">
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077]" />
                <Input
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="h-10 pr-9 text-xs"
                />
              </div>
              <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
                إجمالي النتائج: {filteredData.length}
              </span>
            </div>
          )}

          {/* Mobile Vaul Search & Sort Sheet */}
          <BottomSheet
            open={mobileFilterOpen}
            onOpenChange={setMobileFilterOpen}
            title="البحث والفرز"
          >
            <div className="space-y-4">
              {searchMatcher && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    بحث سريع
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077]" />
                    <Input
                      type="search"
                      inputMode="search"
                      enterKeyHint="search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder={searchPlaceholder}
                      className="pr-10"
                    />
                  </div>
                </div>
              )}

              {sortableColumns.length > 0 && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    ترتيب النتائج حسب
                  </label>
                  <div className="space-y-1.5">
                    {sortableColumns.map((col) => {
                      const active = sortKey === col.key;
                      return (
                        <button
                          key={col.key}
                          type="button"
                          onClick={() => handleSort(col.key)}
                          className={cn(
                            'flex min-h-[44px] w-full items-center justify-between rounded-[10px] border px-3.5 text-xs font-medium',
                            active
                              ? 'border-[#2F6BFF] bg-[#2F6BFF]/10 text-[#2F6BFF]'
                              : 'border-[#E3E8F0] bg-white text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]'
                          )}
                        >
                          <span>{col.header}</span>
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            <ArrowUpDown className="h-3.5 w-3.5 stroke-[1.5]" />
                            {active ? (sortDir === 'desc' ? 'تنازلي' : 'تصاعدي') : 'اختر'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setSortKey(null);
                    setPage(1);
                  }}
                >
                  إعادة ضبط
                </Button>
                <Button type="button" onClick={() => setMobileFilterOpen(false)}>
                  عرض ({filteredData.length})
                </Button>
              </div>
            </div>
          </BottomSheet>
        </>
      )}

      {filteredData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          {/* Mobile Native Card View (< md) */}
          <div className="space-y-3 md:hidden">
            {paginatedRows.map((row) => (
              <article
                key={rowKey(row)}
                className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                {primaryCol && (
                  <div className="border-b border-[#E3E8F0] pb-3 text-sm font-medium text-[#0A1630] dark:border-[#1E325C] dark:text-[#FAFBFC]">
                    {primaryCol.render(row)}
                  </div>
                )}

                <div className="mt-3 space-y-2.5 text-xs">
                  {secondaryCols.map((col) => (
                    <div
                      key={col.key}
                      className="flex flex-wrap items-center justify-between gap-2"
                    >
                      <span className="font-medium text-[#526077] dark:text-[#94A3B8]">
                        {col.header}
                      </span>
                      <div className="text-left text-[#0A1630] dark:text-[#FAFBFC]">
                        {col.render(row)}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Tablet & Desktop Table View (>= md) */}
          <div className="hidden overflow-x-auto rounded-[16px] border border-[#E3E8F0] bg-white md:block dark:border-[#1E325C] dark:bg-[#0A1630]">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-[#E3E8F0] bg-[#FAFBFC] text-[#526077] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#94A3B8]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-4 py-3 font-medium whitespace-nowrap',
                        col.className
                      )}
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(col.key)}
                          className="inline-flex items-center gap-1 hover:text-[#0A1630] dark:hover:text-[#FAFBFC]"
                        >
                          <span>{col.header}</span>
                          <ArrowUpDown className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
                {paginatedRows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className="transition-colors hover:bg-[#F1F4F9]/60 dark:hover:bg-[#070D1F]/50"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn('px-4 py-3.5 align-middle', col.className)}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="font-tabular text-[#526077] dark:text-[#94A3B8]">
            صفحة {safePage} من {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="الصفحة السابقة"
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E3E8F0] bg-white disabled:opacity-40 sm:h-10 sm:w-10 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <ChevronRight className="h-4 w-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="الصفحة التالية"
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E3E8F0] bg-white disabled:opacity-40 sm:h-10 sm:w-10 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
