import { describe, it, expect } from 'vitest';
import { load } from './+page.server';

describe('login/+page.server.ts load', () => {
	it('retourne un formulaire de connexion vide (aucune logique métier server-side ici : l’authentification passe par better-auth côté client)', async () => {
		const result = await load();

		expect(result).toHaveProperty('form');
	});
});
