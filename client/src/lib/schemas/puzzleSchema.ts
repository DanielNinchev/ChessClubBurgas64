import { z } from "zod";

export const puzzleSchema = z.object({
    number: z.number().int().min(1, 'Номерът на задачата е задължителен'),
    description: z.string().min(1, 'Описанието е задължително'),
    fen: z.string().min(1, 'FEN позицията е задължителна'),
    solution: z.string().min(1, 'Решението е задължително'),
    difficulty: z.string().min(1, 'Трудността е задължителна'),
    points: z.coerce.number().int().min(1, 'Точките трябва да са поне 1'),
    whiteToMove: z.boolean(),
    category: z.string().min(1, 'Категорията е задължителна'),
    isCompleted: z.boolean(),
});

export type PuzzleSchema = z.infer<typeof puzzleSchema>;