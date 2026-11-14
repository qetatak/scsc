import React from 'react';
import type { Metadata } from 'next';
import { STUDENTS_DATA } from '@/data/mock-data';
import { StudentProfileClient } from '@/components/students/student-profile-client';
import { getPersonJsonLd, getBreadcrumbJsonLd } from '@/lib/seo/json-ld';

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const student =
    STUDENTS_DATA.find((s) => s.username === username) || STUDENTS_DATA[0];

  return {
    title: `${student.fullName} — البروفايل المهني الموثق`,
    description: `${student.bio} — خريج ${student.university} تخصص ${student.major} بإجمالي ${student.totalXp} نقطة خبرة عملية في مختبرات تدريبك.`,
    alternates: {
      canonical: `/students/${student.username}`,
    },
    openGraph: {
      title: `${student.fullName} — البروفايل المهني في منصة تدريبك`,
      description: student.bio,
      type: 'profile',
    },
  };
}

export default async function StudentPublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const fallbackStudent =
    STUDENTS_DATA.find((s) => s.username === username) || STUDENTS_DATA[0];

  const personJsonLd = getPersonJsonLd(fallbackStudent);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'الرئيسية', path: '/' },
    { name: 'المتصدرون', path: '/leaderboard' },
    { name: fallbackStudent.fullName, path: `/students/${fallbackStudent.username}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            personJsonLd ? [breadcrumbJsonLd, personJsonLd] : [breadcrumbJsonLd]
          ),
        }}
      />
      <StudentProfileClient
        initialUsername={username}
        fallbackStudent={fallbackStudent}
      />
    </>
  );
}
