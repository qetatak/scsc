import type { MetadataRoute } from 'next';
import { STUDENTS_DATA, LABS_METADATA } from '@/data/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://tadreebak.com';
  const lastModified = new Date('2026-11-12');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ar: `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseUrl}/labs`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-companies`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  const labRoutes: MetadataRoute.Sitemap = LABS_METADATA.map((lab) => ({
    url: `${baseUrl}${lab.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const studentRoutes: MetadataRoute.Sitemap = STUDENTS_DATA.filter(
    (s) => s.isPublicToCompanies
  ).map((student) => ({
    url: `${baseUrl}/students/${student.username}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...labRoutes, ...studentRoutes];
}
