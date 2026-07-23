import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDb, resetMockDb, mockSelectJoinedRows, awaitLoadData } from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { load } from './+page.server';

describe('reviewer/+page.server.ts load', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			load({
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est ni reviewer ni admin', async () => {
		await expect(
			load({
				locals: { user: { id: 'user-1', role: 'USER' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('retourne les articles soumis pour un reviewer', async () => {
		mockSelectJoinedRows([
			{
				id: 'art-1',
				title: 'Titre',
				excerpt: 'Extrait',
				status: 'SUBMITTED',
				createdAt: new Date('2026-01-01'),
				authorId: 'user-1',
				authorName: 'Auteur'
			}
		]);

		const result = await awaitLoadData(
			await load({
				locals: { user: { id: 'reviewer-1', role: 'REVIEWER' } }
			} as never)
		);

		expect(result.articles).toHaveLength(1);
		expect(result.user).toEqual({ id: 'reviewer-1', role: 'REVIEWER' });
	});
});
