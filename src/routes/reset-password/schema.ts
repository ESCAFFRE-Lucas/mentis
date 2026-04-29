import { z } from 'zod';

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
			.max(50, 'Le mot de passe est trop long'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirmPassword']
	});

export type ResetPasswordSchema = typeof resetPasswordSchema;
