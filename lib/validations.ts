import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z
    .string()
    .min(6, { message: 'كلمة المرور يجب أن لا تقل عن 6 أحرف' }),
  role: z.enum(['student', 'company']),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  name: z.string().min(3, { message: 'يرجى إدخال الاسم الكامل أو اسم الشركة' }),
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  organizationOrUniversity: z
    .string()
    .min(2, { message: 'يرجى إدخال اسم الجامعة أو القطاع' }),
  password: z
    .string()
    .min(6, { message: 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل' }),
  role: z.enum(['student', 'company']),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const studentProfileSchema = z.object({
  fullName: z.string().min(3, { message: 'الاسم الكامل مطلوب' }),
  university: z.string().min(2, { message: 'اسم الجامعة مطلوب' }),
  major: z.string().min(2, { message: 'التخصص الجامعي مطلوب' }),
  graduationYear: z.string().min(4, { message: 'سنة التخرج مطلوبة' }),
  city: z.string().min(2, { message: 'المدينة مطلوبة' }),
  bio: z.string().min(20, { message: 'النبذة التعريفية يجب أن تكون 20 حرفاً على الأقل' }),
  educationDetails: z.string().min(10, { message: 'تفاصيل التعليم مطلوبة' }),
  githubOrPortfolio: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

export type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

export const contactStudentSchema = z.object({
  companyName: z.string().min(2, { message: 'اسم الشركة مطلوب' }),
  senderRole: z.string().min(2, { message: 'المسمى الوظيفي للمرسل مطلوب' }),
  offeredRoleType: z.string().min(2, { message: 'نوع العرض مطلوب' }),
  subject: z.string().min(5, { message: 'عنوان الرسالة مطلوب (5 أحرف على الأقل)' }),
  message: z.string().min(15, { message: 'نص الرسالة يجب أن لا يقل عن 15 حرفاً' }),
});

export type ContactStudentFormValues = z.infer<typeof contactStudentSchema>;
