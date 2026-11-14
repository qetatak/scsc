import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://tadreebak.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/student/',
        '/teacher/',
        '/company/',
        '/admin/',
        '/unauthorized',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
