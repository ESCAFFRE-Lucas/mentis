import { describe, it, expect } from 'vitest';
import { registerSchema } from './schema';

describe('Validation du Registre (Zod)', () => {
	it('devrait valider un utilisateur correct', () => {
		const result = registerSchema.safeParse({
			name: 'Lucas',
			email: 'test@mentis.fr',
			password: 'password123'
		});
		expect(result.success).toBe(true);
	});

	it('devrait rejeter un email invalide', () => {
		const result = registerSchema.safeParse({
			name: 'Lucas',
			email: 'pas-un-email',
			password: 'password123'
		});
		expect(result.success).toBe(false);
	});
});
