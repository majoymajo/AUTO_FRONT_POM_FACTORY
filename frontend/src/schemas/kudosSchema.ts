import { z } from 'zod';

export const kudosSchema = z.object({
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede exceder 500 caracteres'),
});

export type KudosFormData = z.infer<typeof kudosSchema>;
