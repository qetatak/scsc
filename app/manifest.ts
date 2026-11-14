import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'تدريبك — Tadreebak | المختبرات العملية',
    short_name: 'تدريبك',
    description:
      'منصة مختبرات تفاعلية تحاكي شركة افتراضية في المحاسبة والتسويق وإدارة الأعمال وبرمجة Python لبناء بروفايل مهني موثق.',
    lang: 'ar',
    dir: 'rtl',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    theme_color: '#0A1630',
    background_color: '#FAFBFC',
    categories: ['education', 'business', 'productivity'],
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'المختبرات التفاعلية',
        short_name: 'المختبرات',
        url: '/labs',
      },
      {
        name: 'لوحة الطالب',
        short_name: 'لوحتي',
        url: '/student',
      },
      {
        name: 'جدول المتصدرين',
        short_name: 'المتصدرون',
        url: '/leaderboard',
      },
    ],
  };
}
