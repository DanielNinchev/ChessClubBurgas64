import { z } from 'zod';

export const puzzleSchema = z.object({
    title: z.string().min(1, 'Заглавието е задължително'),
    description: z.string().min(1, 'Описанието е задължително'),
    fen: z.string().min(1, 'FEN позицията е задължителна'),
    solution: z.string().min(1, 'Решението е задължително'),
    difficulty: z.string().min(1, 'Трудността е задължителна'),
    date: z.coerce.date({
        message: 'Датата е задължителна'
    }),
});

export type PuzzleSchema = z.infer<typeof puzzleSchema>;