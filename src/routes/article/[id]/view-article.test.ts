import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.server';
import { db } from '$lib/server/db';
import type { PageServerLoadEvent } from './$types';

vi.mock('$lib/server/db', () => ({
	db: {
		select: vi.fn()
	}
}));

describe('Feature: Visualisation d’article', () => {

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('doit charger les données si l’article existe', async () => {
		const mockArticle = {
			id: 'uuid-123',
			title: 'Mon Article Test',
			content: 'Contenu de test',
			createdAt: new Date(),
			authorName: 'Lucesf'
		};

		const mockQuery = {
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			innerJoin: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([mockArticle])
		} as unknown as ReturnType<typeof db.select>;

		vi.mocked(db.select).mockReturnValue(mockQuery);

		const event = {
			params: { id: 'uuid-123' },
			parent: vi.fn(),
			depends: vi.fn(),
			untrack: vi.fn(),
			locals: { user: null }
		} as unknown as PageServerLoadEvent;

		const result = await load(event);

		expect(result).toHaveProperty('article');
		if (result && 'article' in result) {
			expect(result.article.title).toBe('Mon Article Test');
		}
	});

	it('doit lever une erreur si l’article est introuvable', async () => {
		const mockEmptyQuery = {
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			innerJoin: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([])
		} as unknown as ReturnType<typeof db.select>;

		vi.mocked(db.select).mockReturnValue(mockEmptyQuery);

		const event = {
			params: { id: '999' },
			parent: vi.fn(),
			depends: vi.fn()
		} as unknown as PageServerLoadEvent;

		await expect(load(event)).rejects.toThrow();
	});
});