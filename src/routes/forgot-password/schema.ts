import { z } from 'zod';

export const forgotPasswordSchema = z.object({
	email: z.email("L'adresse email est invalide")
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;