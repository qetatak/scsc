'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogIn, User, Lock, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useAdminStore } from '@/store/use-admin-store';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';
import { triggerHaptic } from '@/lib/haptics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const IS_DEV = process.env.NODE_ENV === 'development';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAppStore();
  const { recordAuditAction } = useAdminStore();
  const { keyboardHeight } = useKeyboardOffset(true);

  const [identifier, setIdentifier] = useState('yazan@students.ju.edu.jo');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        triggerHaptic('error');
        setErrorMessage(data.error || 'تعذر تسجيل الدخول.');
        toast.error(data.error || 'تعذر تسجيل الدخول.');
        setLoading(false);
        return;
      }

      triggerHaptic('success');
      loginUser(data.session);
      recordAuditAction(
        'تسجيل دخول',
        `دخول ناجح إلى النظام (${data.session.role}): ${data.session.name}`,
        data.session.name,
        data.session.role
      );

      toast.success(`مرحباً بك، ${data.session.name}`);
      router.push(data.redirectTo || '/student');
    } catch {
      triggerHaptic('error');
      setErrorMessage('تعذر الاتصال بخادم المصادقة.');
      toast.error('تعذر الاتصال بخادم المصادقة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : undefined }}
      className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg items-center px-4 py-6 sm:px-6 sm:py-12"
    >
      <div className="w-full rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-9 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="mb-6 text-center">
          <p className="mb-2 font-tabular text-xs font-semibold tracking-wider text-[#2F6BFF] uppercase">
            UNIFIED AUTHENTICATION
          </p>
          <h1 className="text-2xl font-semibold text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
            تسجيل الدخول
          </h1>
          <p className="mt-1.5 text-sm text-[#526077] dark:text-[#94A3B8]">
            أدخل بريدك أو اسم المستخدم للانتقال تلقائياً إلى لوحتك المخصصة.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-[10px] border border-red-200 bg-red-50/80 px-4 py-3 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              البريد الإلكتروني أو اسم المستخدم
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077]" />
              <Input
                type="text"
                inputMode="email"
                autoComplete="username"
                enterKeyHint="next"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                dir="ltr"
                required
                placeholder="name@domain.com"
                className="pr-10 text-right"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077]" />
              <Input
                type="password"
                autoComplete="current-password"
                enterKeyHint="go"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                required
                placeholder="••••••••"
                className="pr-10 text-right"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full gap-2"
          >
            <LogIn className="h-4 w-4 stroke-[1.5]" />
            <span>{loading ? 'جارٍ التحقق...' : 'دخول إلى اللوحة'}</span>
          </Button>
        </form>

        {IS_DEV && (
          <div className="mt-6 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                <span>بيانات الاختبار (DEV ONLY):</span>
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('yazan@students.ju.edu.jo');
                  setPassword('password123');
                }}
                className="min-h-[44px] rounded-[10px] border border-[#E3E8F0] bg-white px-3 py-2 text-right transition-colors hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <span className="block font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  حساب الطالب
                </span>
                <span className="font-tabular block truncate text-[10px] text-[#526077]">
                  yazan@students.ju.edu.jo
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('a.khalil@ju.edu.jo');
                  setPassword('teacher123');
                }}
                className="min-h-[44px] rounded-[10px] border border-[#E3E8F0] bg-white px-3 py-2 text-right transition-colors hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <span className="block font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  حساب المعلم
                </span>
                <span className="font-tabular block truncate text-[10px] text-[#526077]">
                  a.khalil@ju.edu.jo
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('talent@futuretech.jo');
                  setPassword('company123');
                }}
                className="min-h-[44px] rounded-[10px] border border-[#E3E8F0] bg-white px-3 py-2 text-right transition-colors hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <span className="block font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  حساب الشركة
                </span>
                <span className="font-tabular block truncate text-[10px] text-[#526077]">
                  talent@futuretech.jo
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin');
                  setPassword('user');
                }}
                className="min-h-[44px] rounded-[10px] border border-[#E3E8F0] bg-white px-3 py-2 text-right transition-colors hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <span className="block font-semibold text-[#2F6BFF]">
                  الأدمن (DEV ONLY)
                </span>
                <span className="font-tabular block truncate text-[10px] text-[#526077]">
                  admin / user
                </span>
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[#526077] dark:text-[#94A3B8]">
          ليس لديك حساب بعد؟{' '}
          <Link
            href="/register"
            className="font-semibold text-[#2F6BFF] hover:underline"
          >
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}
