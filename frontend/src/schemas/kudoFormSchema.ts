import { z } from 'zod';

export const KUDO_CATEGORIES = [
  'Innovation',
  'Teamwork',
  'Passion',
  'Mastery',
] as const;

export const kudoFormSchema = z.object({
  from: z
    .string()
    .min(1, 'From email is required')
    .email('Please enter a valid email address'),
  to: z
    .string()
    .min(1, 'To email is required')
    .email('Please enter a valid email address'),
  category: z.enum(KUDO_CATEGORIES, {
    message: 'Please select a category',
  }),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message cannot exceed 500 characters'),
}).refine((data) => data.from !== data.to, {
  message: "You can't send a kudo to yourself!",
  path: ['to'],
});

export type KudoFormData = z.infer<typeof kudoFormSchema>;
