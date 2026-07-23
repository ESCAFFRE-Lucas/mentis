import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDb, resetMockDb, mockSelectJoinedRows, awaitLoadData } from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { load } from './+page.server';

describe('/+page.server.ts load', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('retourne les articles acceptés avec leur auteur', async () => {
		mockSelectJoinedRows([
			{
				id: 'art-1',
				title: 'Titre',
				excerpt: 'Extrait',
				createdAt: new Date('2026-01-01'),
				authorId: 'user-1',
				authorName: 'Auteur'
			}
		]);

		const result = await awaitLoadData(
			await load({
				locals: { user: null }
			} as never)
		);

		expect(result.articles).toEqual([
			{
				id: 'art-1',
				title: 'Titre',
				excerpt: 'Extrait',
				createdAt: new Date('2026-01-01'),
				author: { id: 'user-1', name: 'Auteur' }
			}
		]);
	});

	it('retourne un tableau vide si aucun article n’est accepté', async () => {
		mockSelectJoinedRows([]);

		const result = await awaitLoadData(
			await load({
				locals: { user: null }
			} as never)
		);

		expect(result.articles).toEqual([]);
	});
});
