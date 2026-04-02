import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Невалиден имейл адрес'),
    firstName: z.string().min(1, 'Името е задължително'),
    middleName: z.string().min(1, 'Презимето е задължително'),
    lastName: z.string().min(1, 'Фамилията е задължителна'),
    password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Паролите не съвпадат',
    path: ['confirmPassword'],
});

export type RegisterSchema = z.infer<typeof registerSchema>;