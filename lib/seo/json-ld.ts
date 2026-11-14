import { StudentTalent } from '@/types';
import { LabMetadata } from '@/data/mock-data';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tadreebak.com';

export function getRootJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tadreebak — تدريبك',
      url: BASE_URL,
      description:
        'منصة مختبرات عملية تفاعلية لطلاب الجامعات والخريجين الجدد في المحاسبة والتسويق وإدارة الأعمال والبرمجة لبناء بروفايل مهني موثق للشركات.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Amman',
        addressCountry: 'JO',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Tadreebak — تدريبك',
      url: BASE_URL,
      inLanguage: 'ar',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/labs?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}

export function getCourseJsonLd(lab: LabMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Course', 'LearningResource'],
    name: lab.title,
    description: lab.description,
    provider: {
      '@type': 'Organization',
      name: 'Tadreebak — تدريبك',
      sameAs: BASE_URL,
    },
    educationalLevel: 'Beginner to Advanced',
    learningResourceType: 'Interactive Simulation Lab',
    inLanguage: 'ar',
    teaches: lab.skillsLearned,
    url: `${BASE_URL}${lab.slug}`,
  };
}

export function getPersonJsonLd(student: StudentTalent) {
  if (!student.isPublicToCompanies) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: student.fullName,
    url: `${BASE_URL}/students/${student.username}`,
    description: student.bio,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: student.university,
    },
    knowsAbout: [
      student.major,
      'المحاسبة المالية',
      'التسويق الرقمي',
      'إدارة الأعمال',
      'Python',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: student.city,
    },
  };
}

export function getBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export const HOME_FAQS: { question: string; answer: string }[] = [
  {
    question: 'هل أحتاج إلى سيرة ذاتية أو خبرة سابقة للبدء؟',
    answer:
      'لا. تبدأ التدريب مباشرة داخل المختبرات بخطوات واضحة، وكل تمرين تحله يضيف نقاطاً ومهارات موثقة إلى ملفك تلقائياً.',
  },
  {
    question: 'كيف ترتبط المختبرات الأربعة ببعضها؟',
    answer:
      'جميع المختبرات تعمل على نفس الشركة الافتراضية؛ فأي حملة تسويقية تطلقها أو قرار إداري تتخذه ينعكس فوراً على الميزانية والأرباح في المحاسبة.',
  },
  {
    question: 'هل أحتاج لتثبيت برامج على جهازي؟',
    answer:
      'لا، جميع المختبرات بما فيها مختبر البرمجة بلغة بايثون تعمل مباشرة من المتصفح على الهاتف والحاسوب وبشكل مجاني للطلاب.',
  },
  {
    question: 'كيف تصل الشركات إلى ملفي وتدعوني لمقابلة؟',
    answer:
      'تبحث فرق التوظيف في جدول المواهب حسب المهارات التي أتقنتها في المختبرات وترسل لك دعوة مقابلة مباشرة عند ملاءمة مستواك.',
  },
];

export function getFaqJsonLd(
  faqs: { question: string; answer: string }[] = HOME_FAQS
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

