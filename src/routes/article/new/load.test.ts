import { describe, it, expect, vi } from 'vitest';
import { mockDb } from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { load } from './+page.server';

describe('article/new/+page.server.ts load', () => {
	it('redirige vers /login si aucune session active', async () => {
		await expect(
			load({
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('retourne un formulaire vide pour un utilisateur connecté', async () => {
		const result = await load({
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(result).toHaveProperty('form');
	});
});
