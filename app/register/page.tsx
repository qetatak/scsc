'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  GraduationCap,
  Building2,
  BookOpen,
  UserPlus,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useAdminStore } from '@/store/use-admin-store';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';
import { triggerHaptic } from '@/lib/haptics';
import { UNIVERSITIES } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const { loginUser } = useAppStore();
  const { submitRegistrationApprovalRequest } = useAdminStore();
  const { keyboardHeight } = useKeyboardOffset(true);

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'student' | 'teacher' | 'company'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationOrUniversity, setOrganizationOrUniversity] = useState(
    UNIVERSITIES[0]
  );
  const [departmentOrReg, setDepartmentOrReg] = useState('');
  const [pendingSubmitted, setPendingSubmitted] = useState(false);

  const handleNextStep = () => {
    if (name.trim().length < 3 || organizationOrUniversity.trim().length < 2) {
      triggerHaptic('error');
      toast.error('يرجى كتابة الاسم والمؤسسة أو الجامعة قبل المتابعة.');
      return;
    }
    triggerHaptic('tap');
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || !email.includes('@') || password.length < 6) {
      triggerHaptic('error');
      toast.error('يرجى تعبئة كافة الحقول المطلوبة بشكل صحيح.');
      return;
    }

    if (role === 'teacher') {
      submitRegistrationApprovalRequest({
        applicantName: name.trim(),
        applicantEmail: email.trim(),
        role: 'teacher',
        organizationOrUniversity: organizationOrUniversity.trim(),
        departmentOrCommercialReg:
          departmentOrReg.trim() || 'كلية الأعمال وتقنية المعلومات',
        notes: 'طلب تسجيل معلم جديد عبر بوابة التسجيل الموحدة.',
      });
      triggerHaptic('success');
      setPendingSubmitted(true);
      toast.success('تم إرسال طلب تفعيل حساب المعلم إلى إدارة المنصة.');
      return;
    }

    loginUser({
      id: `usr-${role}-${Date.now()}`,
      name: name.trim(),
      username: role === 'student' ? 'yazan-nabulsi' : 'futuretech-hr',
      email: email.trim(),
      role,
      organizationOrUniversity: organizationOrUniversity.trim(),
      approvalStatus: 'approved',
    });

    triggerHaptic('success');
    toast.success(
      role === 'student' ? 'تم إنشاء حساب الطالب بنجاح' : 'تم إنشاء حساب الشركة بنجاح'
    );
    router.push(role === 'student' ? '/student' : '/company');
  };

  if (pendingSubmitted) {
    return (
      <div className="mx-auto flex min-h-[75dvh] max-w-lg items-center px-4 py-12">
        <div className="w-full rounded-[16px] border border-[#E3E8F0] bg-white p-6 text-center sm:p-8 dark:border-[#1E325C] dark:bg-[#0A1630]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#2F6BFF]/10 text-[#2F6BFF]">
            <CheckCircle2 className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h1 className="text-xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            طلب تفعيل المعلم قيد المراجعة
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
            شكراً لانضمامك يا {name}. يحتاج حساب عضو هيئة التدريس إلى موافقة مسؤول المنصة قبل تفعيله.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link href="/login">
              <Button className="w-full">العودة لتسجيل الدخول</Button>
            </Link>
            <Link
              href="/"
              className="min-h-[40px] inline-flex items-center justify-center text-xs text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8]"
            >
              الرجوع للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 90 : undefined }}
      className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center px-4 pt-6 pb-28 sm:px-6 sm:py-12"
    >
      <div className="w-full rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-9 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="mb-5 flex items-center justify-between border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
          <div>
            <p className="font-tabular text-xs font-semibold tracking-wider text-[#2F6BFF] uppercase">
              CREATE ACCOUNT
            </p>
            <h1 className="mt-1 text-xl font-semibold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
              إنشاء حساب جديد
            </h1>
          </div>
          <span className="font-tabular rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 py-1.5 text-xs font-medium text-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#070D1F]">
            الخطوة {step} / 2
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-5 grid grid-cols-2 gap-2">
          <div className="h-1.5 rounded-full bg-[#2F6BFF]" />
          <div
            className={`h-1.5 rounded-full transition-colors ${
              step === 2 ? 'bg-[#2F6BFF]' : 'bg-[#E3E8F0] dark:bg-[#1E325C]'
            }`}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  نوع الحساب
                </label>
                <div className="grid grid-cols-3 gap-1.5 rounded-[12px] bg-[#F1F4F9] p-1.5 dark:bg-[#070D1F]">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex min-h-[48px] flex-col sm:flex-row items-center justify-center gap-1 rounded-[10px] px-1.5 py-2 text-[11px] sm:text-xs font-semibold transition-all ${
                      role === 'student'
                        ? 'bg-white text-[#2F6BFF] shadow-xs dark:bg-[#0A1630]'
                        : 'text-[#526077] dark:text-[#94A3B8]'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4 stroke-[1.5]" />
                    <span>طالب / خريج</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex min-h-[48px] flex-col sm:flex-row items-center justify-center gap-1 rounded-[10px] px-1.5 py-2 text-[11px] sm:text-xs font-semibold transition-all ${
                      role === 'teacher'
                        ? 'bg-white text-[#2F6BFF] shadow-xs dark:bg-[#0A1630]'
                        : 'text-[#526077] dark:text-[#94A3B8]'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 stroke-[1.5]" />
                    <span>معلم جامعي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`flex min-h-[48px] flex-col sm:flex-row items-center justify-center gap-1 rounded-[10px] px-1.5 py-2 text-[11px] sm:text-xs font-semibold transition-all ${
                      role === 'company'
                        ? 'bg-white text-[#2F6BFF] shadow-xs dark:bg-[#0A1630]'
                        : 'text-[#526077] dark:text-[#94A3B8]'
                    }`}
                  >
                    <Building2 className="h-4 w-4 stroke-[1.5]" />
                    <span>شركة توظيف</span>
                  </button>
                </div>
              </div>

              {role === 'teacher' && (
                <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 text-xs text-[#526077] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#94A3B8]">
                  يخضع حساب المعلم الجامعي لموافقة إدارة المنصة لضمان موثوقية الشعب.
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  {role === 'student'
                    ? 'الاسم الكامل'
                    : role === 'teacher'
                    ? 'الاسم الأكاديمي'
                    : 'اسم مسؤول التوظيف'}
                </label>
                <Input
                  type="text"
                  autoComplete="name"
                  enterKeyHint="next"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={
                    role === 'student'
                      ? 'مثال: يزن النابلسي'
                      : role === 'teacher'
                      ? 'د. أحمد خليل'
                      : 'سارة الخطيب'
                  }
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  {role === 'company' ? 'اسم الشركة أو المؤسسة' : 'الجامعة'}
                </label>
                <Input
                  type="text"
                  autoComplete="organization"
                  enterKeyHint="next"
                  value={organizationOrUniversity}
                  onChange={(e) => setOrganizationOrUniversity(e.target.value)}
                  required
                  placeholder="الجامعة الأردنية"
                />
              </div>

              <div className="hidden pt-2 sm:block">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleNextStep}
                  className="w-full gap-2"
                >
                  <span>التالي: بيانات الدخول</span>
                  <ArrowLeft className="h-4 w-4 stroke-[1.5]" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {role !== 'student' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    {role === 'teacher'
                      ? 'الكلية / القسم الأكاديمي'
                      : 'رقم السجل التجاري'}
                  </label>
                  <Input
                    type="text"
                    enterKeyHint="next"
                    value={departmentOrReg}
                    onChange={(e) => setDepartmentOrReg(e.target.value)}
                    required
                    placeholder={
                      role === 'teacher' ? 'كلية الأعمال' : '200184920'
                    }
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  البريد الإلكتروني الرسمي
                </label>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  required
                  placeholder="name@university.edu"
                  className="text-right"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  كلمة المرور (6 خانات على الأقل)
                </label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  enterKeyHint="done"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  required
                  placeholder="••••••••"
                  className="text-right"
                />
              </div>

              <div className="hidden grid-cols-3 gap-2.5 pt-2 sm:grid">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  السابق
                </Button>
                <Button type="submit" size="lg" className="col-span-2 gap-2">
                  <UserPlus className="h-4 w-4 stroke-[1.5]" />
                  <span>
                    {role === 'teacher' ? 'إرسال طلب التفعيل' : 'إنشاء الحساب'}
                  </span>
                </Button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-[#526077] dark:text-[#94A3B8]">
          لديك حساب بالفعل؟{' '}
          <Link
            href="/login"
            className="font-semibold text-[#2F6BFF] hover:underline"
          >
            سجّل دخولك
          </Link>
        </p>
      </div>

      {/* Sticky Mobile Bottom CTA Bar above Keyboard / Safe Area */}
      <div
        style={{ bottom: keyboardHeight > 0 ? keyboardHeight : 0 }}
        className="fixed inset-x-0 z-40 border-t border-[#E3E8F0] bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden dark:border-[#1E325C] dark:bg-[#0A1630]/95"
      >
        {step === 1 ? (
          <Button
            type="button"
            size="lg"
            onClick={handleNextStep}
            className="w-full gap-2"
          >
            <span>التالي: بيانات الدخول</span>
            <ArrowLeft className="h-4 w-4 stroke-[1.5]" />
          </Button>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setStep(1)}
              className="gap-1"
            >
              <ArrowRight className="h-4 w-4 stroke-[1.5]" />
              <span>السابق</span>
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={handleSubmit}
              className="col-span-2 gap-2"
            >
              <UserPlus className="h-4 w-4 stroke-[1.5]" />
              <span>{role === 'teacher' ? 'إرسال الطلب' : 'إنشاء الحساب'}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
