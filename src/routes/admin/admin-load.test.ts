import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDb, resetMockDb, awaitLoadData } from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { load } from './+page.server';

describe('admin/+page.server.ts load', () => {
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

	it('refuse avec un 403 si l’appelant n’est pas admin', async () => {
		await expect(
			load({
				locals: { user: { id: 'user-1', role: 'USER' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('retourne la liste des utilisateurs et les stats d’articles pour un admin', async () => {
		mockDb.select
			.mockReturnValueOnce({
				from: () => ({
					orderBy: () =>
						Promise.resolve([
							{
								id: 'user-1',
								name: 'Alice',
								email: 'alice@mentis.com',
								role: 'USER',
								reputationScore: 0,
								createdAt: new Date('2026-01-01')
							}
						])
				})
			})
			.mockReturnValueOnce({
				from: () => ({
					groupBy: () => Promise.resolve([{ status: 'DRAFT', count: 2 }])
				})
			});

		const result = await awaitLoadData(
			await load({
				locals: { user: { id: 'admin-1', role: 'ADMIN' } }
			} as never)
		);

		expect(result.users).toHaveLength(1);
		expect(result.stats).toMatchObject({ DRAFT: 2, SUBMITTED: 0 });
	});
});
