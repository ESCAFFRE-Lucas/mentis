import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	mockDb,
	resetMockDb,
	mockSelectRows,
	mockUpdate,
	realFormDataRequest,
	awaitLoadData
} from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { load, actions } from './+page.server';

function editFormRequest() {
	return realFormDataRequest({
		title: 'Titre modifié valide',
		excerpt: 'Un résumé valide de plus de dix caractères.',
		content: 'Un contenu modifié assez long pour passer la validation de vingt caractères.'
	});
}

describe('article/[id]/edit/+page.server.ts load', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('retourne le formulaire pré-rempli pour l’auteur d’un brouillon', async () => {
		mockSelectRows([
			{
				id: 'art-1',
				status: 'DRAFT',
				authorId: 'user-1',
				title: 'Titre',
				excerpt: 'Extrait',
				content: 'Contenu'
			}
		]);

		const result = await awaitLoadData(
			await load({
				params: { id: 'art-1' },
				locals: { user: { id: 'user-1' } }
			} as never)
		);

		expect(result.articleId).toBe('art-1');
		expect(result.form.data).toMatchObject({
			title: 'Titre',
			excerpt: 'Extrait',
			content: 'Contenu'
		});
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			load({
				params: { id: 'art-1' },
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est pas l’auteur de l’article', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-2' }]);

		await expect(
			load({
				params: { id: 'art-1' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('refuse avec un 403 si l’article n’est plus un brouillon', async () => {
		mockSelectRows([{ id: 'art-1', status: 'SUBMITTED', authorId: 'user-1' }]);

		await expect(
			load({
				params: { id: 'art-1' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('renvoie une 404 si l’article n’existe pas', async () => {
		mockSelectRows([]);

		await expect(
			load({
				params: { id: 'inconnu' },
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});
});

describe('article/[id]/edit/+page.server.ts action update', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('met à jour un brouillon dont on est l’auteur et redirige vers l’article', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-1' }]);
		const set = mockUpdate();

		await expect(
			actions.default({
				params: { id: 'art-1' },
				request: editFormRequest(),
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/article/art-1' });

		expect(set).toHaveBeenCalledWith(expect.objectContaining({ title: 'Titre modifié valide' }));
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			actions.default({
				params: { id: 'art-1' },
				request: editFormRequest(),
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est pas l’auteur de l’article', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-2' }]);

		await expect(
			actions.default({
				params: { id: 'art-1' },
				request: editFormRequest(),
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('refuse avec un 403 si l’article n’est plus un brouillon', async () => {
		mockSelectRows([{ id: 'art-1', status: 'SUBMITTED', authorId: 'user-1' }]);

		await expect(
			actions.default({
				params: { id: 'art-1' },
				request: editFormRequest(),
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('renvoie une 404 si l’article n’existe pas', async () => {
		mockSelectRows([]);

		await expect(
			actions.default({
				params: { id: 'inconnu' },
				request: editFormRequest(),
				locals: { user: { id: 'user-1' } }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});

	it('refuse une soumission invalide (titre trop court) avec un fail 400', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-1' }]);

		const result = await actions.default({
			params: { id: 'art-1' },
			request: realFormDataRequest({
				title: 'A',
				excerpt: 'Un résumé valide ici',
				content: 'Contenu valide de plus de vingt caractères.'
			}),
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(result).toMatchObject({ status: 400 });
	});

	it('renvoie un fail 500 si la mise à jour DB échoue', async () => {
		mockSelectRows([{ id: 'art-1', status: 'DRAFT', authorId: 'user-1' }]);
		mockDb.update.mockReturnValue({
			set: () => ({
				where: () => Promise.reject(new Error('connexion DB perdue'))
			})
		});

		const result = await actions.default({
			params: { id: 'art-1' },
			request: editFormRequest(),
			locals: { user: { id: 'user-1' } }
		} as never);

		expect(result).toMatchObject({
			status: 500,
			data: { message: expect.stringContaining('mise à jour') }
		});
	});
});
