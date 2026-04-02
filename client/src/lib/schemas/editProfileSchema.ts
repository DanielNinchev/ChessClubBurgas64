import { z } from 'zod';

export const editProfileSchema = z.object({
    firstName: z.string().min(1, 'Името е задължително'),
    middleName: z.string().min(1, 'Презимето е задължително'),
    lastName: z.string().min(1, 'Фамилията е задължителна'),
    phoneNumber: z.string().optional().nullable(),
    // Student-specific
    address: z.string().optional().nullable(),
    school: z.string().optional().nullable(),
    // Teacher-specific
    bio: z.string().optional().nullable(),
    specialization: z.string().optional().nullable(),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;