'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { COMPANY_PARTNERS, STUDENTS_DATA } from '@/data/mock-data';
import { Button } from '@/components/ui/button';

export default function ForCompaniesPage() {
  const topPreviewStudents = STUDENTS_DATA.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-12 lg:px-8">
      {/* B2B Hero Section on Deep Navy */}
      <section className="rounded-[16px] border border-[#1E325C] bg-[#0A1630] p-5 text-[#FAFBFC] sm:p-12 lg:p-16">
        <span className="font-tabular text-xs font-medium tracking-widest text-[#2F6BFF] uppercase">
          TADREEBAK FOR HIRING TEAMS
        </span>
        <h1
          className="mt-3 max-w-4xl font-semibold tracking-tight"
          style={{ fontSize: 'clamp(28px, 4.4vw, 58px)', lineHeight: 1.15 }}
        >
          استقطب الخريجين بناءً على نتائج المختبرات، لا السير الذاتية الإنشائية.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
          يوفّر جدول المواهب في تدريبك بيانات أداء حقيقية لكل طالب في المحاسبة والتسويق وإدارة الأعمال وبرمجة Python، مع معاينة فورية لمخطط الرادار وتواصل مباشر.
        </p>

        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link href="/company/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              <span>افتح جدول البحث والمعاينة</span>
              <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
            </Button>
          </Link>
          <Link href="/leaderboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-[#1E325C] bg-transparent text-[#FAFBFC] hover:border-[#2F6BFF] hover:text-[#2F6BFF] sm:w-auto"
            >
              استعراض جدول المتصدرين
            </Button>
          </Link>
        </div>
      </section>

      {/* 3 B2B Value Columns */}
      <section className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 md:grid-cols-3">
        {[
          {
            num: '01',
            title: 'قياس عملي موحد قبل المقابلة',
            desc: 'شاهد درجات المرشح الفعلية في موازنة القوائم المالية وحساب العائد الإعلاني وكتابة دوال Python قبل إجراء المكالمة الأولى.',
          },
          {
            num: '02',
            title: 'جدول فرز فوري ومعاينة جانبية',
            desc: 'افرز المرشحين حسب إجمالي الخبرة أو حسب مختبر محدد، واستعرض البروفايل الكامل ومخطط الرادار في اللوحة الجانبية دون مغادرة الصفحة.',
          },
          {
            num: '03',
            title: 'تواصل مباشر وقائمة مختصرة',
            desc: 'احفظ المرشحين المطابقين في قائمتك المختصرة وأرسل دعوات المقابلات مباشرة إلى صندوق رسائل الطالب.',
          },
        ].map((item) => (
          <div
            key={item.num}
            className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-7 dark:border-[#1E325C] dark:bg-[#0A1630]"
          >
            <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
              {item.num} / CAPABILITY
            </span>
            <h2 className="mt-2.5 text-lg font-semibold text-[#0A1630] sm:text-xl dark:text-[#FAFBFC]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Sample Talent Table */}
      <section className="mt-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-tabular text-xs font-medium tracking-widest text-[#2F6BFF] uppercase">
              LIVE TALENT INDEX PREVIEW
            </span>
            <h2 className="mt-2 text-2xl font-medium text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
              عينة من المرشحين الجاهزين للتوظيف.
            </h2>
          </div>
          <Link href="/company/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <span>الانتقال لجدول الفرز الكامل ({STUDENTS_DATA.length} مرشح)</span>
              <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
            </Button>
          </Link>
        </div>

        {/* Mobile Candidate Cards (< md) */}
        <div className="space-y-3 md:hidden">
          {topPreviewStudents.map((s) => (
            <Link
              key={s.id}
              href={`/students/${s.username}`}
              className="block rounded-[16px] border border-[#E3E8F0] bg-white p-4 transition-transform active:scale-[0.99] dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
                <div>
                  <p className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {s.fullName}
                  </p>
                  <p className="text-xs text-[#0A1630]/70 dark:text-[#94A3B8]">
                    {s.major} · {s.university}
                  </p>
                </div>
                <span className="font-tabular shrink-0 text-sm font-semibold text-[#2F6BFF]">
                  {s.totalXp.toLocaleString('en-US')} XP
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 text-center font-tabular text-[11px]">
                <div className="rounded-[8px] bg-[#F1F4F9] py-1.5 dark:bg-[#0A1630]">
                  <span className="block text-[10px] text-[#526077] dark:text-[#94A3B8]">محاسبة</span>
                  <span className="font-semibold">{s.labXp.accounting}</span>
                </div>
                <div className="rounded-[8px] bg-[#F1F4F9] py-1.5 dark:bg-[#0A1630]">
                  <span className="block text-[10px] text-[#526077] dark:text-[#94A3B8]">تسويق</span>
                  <span className="font-semibold">{s.labXp.marketing}</span>
                </div>
                <div className="rounded-[8px] bg-[#F1F4F9] py-1.5 dark:bg-[#0A1630]">
                  <span className="block text-[10px] text-[#526077] dark:text-[#94A3B8]">إدارة</span>
                  <span className="font-semibold">{s.labXp.management}</span>
                </div>
                <div className="rounded-[8px] bg-[#F1F4F9] py-1.5 dark:bg-[#0A1630]">
                  <span className="block text-[10px] text-[#526077] dark:text-[#94A3B8]">Python</span>
                  <span className="font-semibold">{s.labXp.python}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tablet & Desktop Candidate Table (>= md) */}
        <div className="hidden overflow-hidden rounded-[16px] border border-[#E3E8F0] bg-white md:block dark:border-[#1E325C] dark:bg-[#0A1630]">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-[#E3E8F0] bg-[#F1F4F9] text-xs font-medium text-[#0A1630]/65 dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#94A3B8]">
                <tr>
                  <th className="px-5 py-3.5">المرشح</th>
                  <th className="px-5 py-3.5">الجامعة والتخصص</th>
                  <th className="px-5 py-3.5">المحاسبة</th>
                  <th className="px-5 py-3.5">التسويق</th>
                  <th className="px-5 py-3.5">الإدارة</th>
                  <th className="px-5 py-3.5">Python</th>
                  <th className="px-5 py-3.5">الإجمالي</th>
                  <th className="px-5 py-3.5 text-left">الملف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
                {topPreviewStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F1F4F9]/60 dark:hover:bg-[#0A1630]/60">
                    <td className="px-5 py-4 font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      {s.fullName}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#0A1630]/70 dark:text-[#94A3B8]">
                      {s.major} · {s.university}
                    </td>
                    <td className="px-5 py-4 font-tabular text-xs">{s.labXp.accounting} XP</td>
                    <td className="px-5 py-4 font-tabular text-xs">{s.labXp.marketing} XP</td>
                    <td className="px-5 py-4 font-tabular text-xs">{s.labXp.management} XP</td>
                    <td className="px-5 py-4 font-tabular text-xs">{s.labXp.python} XP</td>
                    <td className="px-5 py-4 font-tabular text-sm font-semibold text-[#2F6BFF]">
                      {s.totalXp.toLocaleString('en-US')} XP
                    </td>
                    <td className="px-5 py-4 text-left">
                      <Link
                        href={`/students/${s.username}`}
                        className="text-xs font-medium text-[#2F6BFF] hover:underline"
                      >
                        عرض البروفايل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partner Companies Grid */}
      <section className="mt-20">
        <h2 className="mb-6 text-xl font-medium text-[#0A1630] dark:text-[#FAFBFC]">
          الجهات الشريكة في استقطاب الخريجين
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANY_PARTNERS.map((comp) => (
            <div
              key={comp.id}
              className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0A1630] text-xs font-semibold text-[#FAFBFC] dark:bg-[#2F6BFF]">
                  {comp.initials}
                </span>
                <span className="font-tabular text-xs text-[#0A1630]/55 dark:text-[#94A3B8]">
                  {comp.employeesRange}
                </span>
              </div>
              <h3 className="mt-3 text-base font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                {comp.name}
              </h3>
              <p className="mt-1 text-xs text-[#0A1630]/65 dark:text-[#94A3B8]">
                {comp.industry} · {comp.city}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
