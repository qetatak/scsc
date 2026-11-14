'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/use-app-store';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    if (user?.role === 'company') {
      router.replace('/company');
    } else if (user?.role === 'teacher') {
      router.replace('/teacher');
    } else if (user?.role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/student');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#526077]">
      جارٍ توجيهك إلى لوحة التحكم الخاصة بك...
    </div>
  );
}
