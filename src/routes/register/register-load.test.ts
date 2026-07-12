import { describe, it, expect } from 'vitest';
import { load } from './+page.server';

describe('register/+page.server.ts load', () => {
	it('retourne un formulaire d’inscription vide (aucune logique métier server-side ici : l’inscription passe par better-auth côté client)', async () => {
		const result = await load();

		expect(result).toHaveProperty('form');
	});
});
