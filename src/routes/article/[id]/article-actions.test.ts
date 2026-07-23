import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDb, resetMockDb, mockSelectRows, mockUpdate } from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { actions } from './+page.server';

describe('article/[id]/+page.server.ts action submit', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('soumet l’article pour review quand il est en DRAFT et que l’appelant en est l’auteur', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-1' }]);
		const set = mockUpdate();

		const result = await actions.submit({
			params: { id: 'art-1' },
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(result).toEqual({ success: true, message: 'Article soumis pour review' });
		expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: 'SUBMITTED' }));
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			actions.submit({
				params: { id: 'art-1' },
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est pas l’auteur de l’article', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-2' }]);

		await expect(
			actions.submit({
				params: { id: 'art-1' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('refuse de soumettre un article qui n’est plus en DRAFT', async () => {
		mockSelectRows([{ id: 'art-1', status: 'SUBMITTED', authorId: 'user-1' }]);

		const result = await actions.submit({
			params: { id: 'art-1' },
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(result).toMatchObject({
			status: 400,
			data: { message: expect.stringContaining('SUBMITTED') }
		});
	});

	it('renvoie une 404 si l’article n’existe pas', async () => {
		mockSelectRows([]);

		await expect(
			actions.submit({
				params: { id: 'inconnu' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});
});

describe('article/[id]/+page.server.ts action archive', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('archive un brouillon et redirige vers /mes-articles', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-1' }]);
		const set = mockUpdate();

		await expect(
			actions.archive({
				params: { id: 'art-1' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/mes-articles' });

		expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: 'ARCHIVED' }));
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			actions.archive({
				params: { id: 'art-1' },
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est pas l’auteur de l’article', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-2' }]);

		await expect(
			actions.archive({
				params: { id: 'art-1' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('refuse d’archiver un article qui n’est pas un brouillon', async () => {
		mockSelectRows([{ id: 'art-1', status: 'SUBMITTED', authorId: 'user-1' }]);

		const result = await actions.archive({
			params: { id: 'art-1' },
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(result).toMatchObject({
			status: 400,
			data: { message: expect.stringContaining('brouillons') }
		});
	});

	it('renvoie une 404 si l’article n’existe pas', async () => {
		mockSelectRows([]);

		await expect(
			actions.archive({
				params: { id: 'inconnu' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});
});

describe('article/[id]/+page.server.ts action restore', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('restaure un article archivé en brouillon', async () => {
		mockSelectRows([{ id: 'art-1', status: 'ARCHIVED', authorId: 'user-1' }]);
		const set = mockUpdate();

		const result = await actions.restore({
			params: { id: 'art-1' },
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: 'DRAFT' }));
		expect(result).toEqual({ success: true, message: 'Article restauré en brouillon' });
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			actions.restore({
				params: { id: 'art-1' },
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est pas l’auteur de l’article', async () => {
		mockSelectRows([{ id: 'art-1', status: 'ARCHIVED', authorId: 'user-2' }]);

		await expect(
			actions.restore({
				params: { id: 'art-1' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('refuse de restaurer un article qui n’est pas archivé', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-1' }]);

		const result = await actions.restore({
			params: { id: 'art-1' },
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(result).toMatchObject({
			status: 400,
			data: { message: expect.stringContaining('archivés') }
		});
	});

	it('renvoie une 404 si l’article n’existe pas', async () => {
		mockSelectRows([]);

		await expect(
			actions.restore({
				params: { id: 'inconnu' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});
});
