import { z } from 'zod';

export const announcementSchema = z.object({
    title: z.string().min(1, 'Заглавието е задължително'),
    description: z.string().min(1, 'Описанието е задължително'),
    text: z.string().min(1, 'Текстът е задължителен'),
    date: z.coerce.date({ required_error: 'Датата е задължителна' }),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;