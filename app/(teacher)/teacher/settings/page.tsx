'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TeacherSettingsPage() {
  const [name, setName] = useState('د. أحمد خليل العساف');
  const [email, setEmail] = useState('a.khalil@ju.edu.jo');
  const [university, setUniversity] = useState('الجامعة الأردنية');
  const [department, setDepartment] = useState(
    'كلية الأعمال — قسم المحاسبة ونظم المعلومات'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم حفظ إعدادات الحساب الأكاديمي بنجاح');
  };

  return (
    <div>
      <PageHeader
        title="إعدادات الحساب الأكاديمي"
        description="تحكم ببياناتك الجامعية وإعدادات إشعارات تسليم الواجبات العملية."
      />

      <ChartCard
        title="البيانات الشخصية والأكاديمية"
        subtitle="تظهر هذه المعلومات لطلابك في الشُعب الدراسية وعلى ترويسة الواجبات المنشورة."
      >
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>الاسم الأكاديمي الكامل</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>البريد الجامعي الرسمي</Label>
            <Input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>الجامعة</Label>
            <Input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>الكلية / القسم الأكاديمي</Label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="md:col-span-2 flex justify-end pt-2">
            <Button type="submit" size="sm" className="gap-1.5">
              <Save className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>حفظ التعديلات</span>
            </Button>
          </div>
        </form>
      </ChartCard>
    </div>
  );
}
