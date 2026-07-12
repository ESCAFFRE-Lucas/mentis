import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDb, resetMockDb, awaitLoadData } from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { load } from './+page.server';

function mockArticleAndReviews(articleRows: unknown[], reviewRows: unknown[]) {
	mockDb.select
		.mockReturnValueOnce({
			from: () => ({
				where: () => ({
					innerJoin: () => ({
						limit: () => Promise.resolve(articleRows)
					})
				})
			})
		})
		.mockReturnValueOnce({
			from: () => ({
				innerJoin: () => ({
					where: () => ({
						orderBy: () => Promise.resolve(reviewRows)
					})
				})
			})
		});
}

describe('article/[id]/+page.server.ts load', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('retourne l’article et ses reviews', async () => {
		mockArticleAndReviews(
			[{ id: 'art-1', title: 'Titre', status: 'ACCEPTED', authorName: 'Auteur' }],
			[{ id: 'rev-1', decision: 'ACCEPT', comment: 'Bon article', reviewerName: 'Reviewer' }]
		);

		const result = await awaitLoadData(
			await load({
				params: { id: 'art-1' },
				locals: { user: null }
			} as never)
		);

		expect(result.article).toMatchObject({ id: 'art-1', title: 'Titre' });
		expect(result.reviews).toHaveLength(1);
	});

	it('renvoie une 404 si l’article n’existe pas', async () => {
		mockArticleAndReviews([], []);

		await expect(
			load({
				params: { id: 'inconnu' },
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});
});
