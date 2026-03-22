import { describe, it, expect } from 'vitest';
import { loginSchema } from './schema';

describe('Login Schema Validation', () => {
	it('devrait accepter un email et un mot de passe valides', () => {
		const validData = {
			email: 'lucas@mentis.com',
			password: 'cestunmdpaléatoire'
		};
		const result = loginSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('devrait rejeter un email invalide', () => {
		const invalidData = {
			email: 'ceci-nest-pas-un-email',
			password: 'password'
		};
		const result = loginSchema.safeParse(invalidData);
		expect(result.success).toBe(false);

		if (!result.success) {
			expect(result.error.issues[0].message).toBe("L'adresse email est invalide");
		}
	});

	it('devrait rejeter un mot de passe vide', () => {
		const invalidData = {
			email: 'test@mentis.com',
			password: ''
		};
		const result = loginSchema.safeParse(invalidData);
		expect(result.success).toBe(false);

		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Le mot de passe est requis");
		}
	});
});