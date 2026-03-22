import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email("L'adresse email est invalide"),
	password: z.string().min(1, "Le mot de passe est requis")
});

export type LoginSchema = z.infer<typeof loginSchema>;