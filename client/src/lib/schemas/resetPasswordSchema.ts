import { z } from 'zod';

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Паролите не съвпадат',
    path: ['confirmPassword'],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;