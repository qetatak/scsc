import React from 'react';
import { HomeSections } from '@/components/home/home-sections';
import { getFaqJsonLd, HOME_FAQS } from '@/lib/seo/json-ld';

export default function HomePage() {
  const faqJsonLd = getFaqJsonLd(HOME_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeSections />
    </>
  );
}

