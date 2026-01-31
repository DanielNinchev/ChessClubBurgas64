import { z } from 'zod';
import { requiredString } from '../util/util';

export const announcementSchema = z.object({
    title: requiredString('Title'),
    description: requiredString('Description'),
    text: requiredString('Text'),
    date: z.coerce.date({
        message: 'Датата е задължителна'
    }),
    mainPhotoUrl: requiredString('MainPhotoUrl'),
    photo: z.object({
        url: requiredString('Url'),
        isMain: z.boolean().optional()
    })
})

export type AnnouncementSchema = z.infer<typeof announcementSchema>;