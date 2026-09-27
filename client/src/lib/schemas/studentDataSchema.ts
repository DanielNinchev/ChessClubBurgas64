import { isValid, parseISO } from "date-fns";
import { z } from "zod";

// All student data is optional - blank fields are saved as empty
export const studentDataSchema = z.object({
    address: z.string().max(200, 'Адресът може да е до 200 символа').optional(),
    school: z.string().max(150, 'Името на училището може да е до 150 символа').optional(),
    phoneNumber: z.string().optional()
        .refine(v => !v || /^\+?[0-9\s\-()]{6,20}$/.test(v), 'Невалиден телефонен номер'),
    birthDate: z.string().optional()
        .refine(v => {
            if (!v) return true;
            const date = parseISO(v);
            return isValid(date) && date.getFullYear() >= 1900 && date <= new Date();
        }, 'Невалидна дата на раждане'),
});

export type StudentDataSchema = z.infer<typeof studentDataSchema>;
