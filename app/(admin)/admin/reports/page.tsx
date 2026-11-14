'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Download, Printer } from 'lucide-react';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UNIVERSITY_PERFORMANCE = [
  { university: 'الجامعة الأردنية', completionRate: 91, avgScore: 88 },
  { university: 'جامعة العلوم والتكنولوجيا', completionRate: 89, avgScore: 86 },
  { university: 'جامعة الأميرة سمية', completionRate: 94, avgScore: 91 },
  { university: 'الجامعة الهاشمية', completionRate: 84, avgScore: 82 },
  { university: 'جامعة اليرموك', completionRate: 81, avgScore: 80 },
];

export default function AdminReportsPage() {
  const handleDownloadCsv = () => {
    const csv =
      '\uFEFFالجامعة,نسبة إتمام الواجبات (%),متوسط الدرجات (%)\n' +
      UNIVERSITY_PERFORMANCE.map(
        (u) => `"${u.university}",${u.completionRate},${u.avgScore}`
      ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tadreebak-national-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('تم تنزيل التقرير الإحصائي بصيغة CSV');
  };

  return (
    <div>
      <PageHeader
        title="التقارير الإحصائية وتحليلات الجامعات"
        description="تقرير مقارن لمعدلات إنجاز الواجبات العملية ومتوسط إتقان المهارات حسب الجامعة والتخصص."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>طباعة التقرير (PDF)</span>
            </Button>
            <Button size="sm" onClick={handleDownloadCsv} className="gap-1.5">
              <Download className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>تصدير CSV</span>
            </Button>
          </>
        }
      />

      <ChartCard
        title="مقارنة أداء الجامعات في المختبرات العملية"
        subtitle="نسبة إتمام الواجبات العملية ومتوسط درجات التصحيح التلقائي لكل جامعة"
      >
        <div className="h-[220px] sm:h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={UNIVERSITY_PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
              <XAxis
                dataKey="university"
                tick={{ fontSize: 11, fill: '#526077' }}
                axisLine={{ stroke: '#E3E8F0' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#526077' }}
                axisLine={{ stroke: '#E3E8F0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1630',
                  border: '1px solid #1E325C',
                  borderRadius: '10px',
                  color: '#FAFBFC',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey="completionRate"
                name="نسبة الإتمام (%)"
                fill="#2F6BFF"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="avgScore"
                name="متوسط الدرجات (%)"
                fill="#0A1630"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
