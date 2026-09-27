import { z } from "zod";
import { requiredString } from "../util/util";

export const changeEmailSchema = z.object({
    newEmail: requiredString('Новият имейл').email('Невалиден имейл адрес'),
    currentPassword: requiredString('Паролата'),
});

export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;
