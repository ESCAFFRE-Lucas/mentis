import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	mockDb,
	resetMockDb,
	mockSelectRows,
	mockUpdate,
	mockInsert,
	formDataRequest
} from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { actions } from './+page.server';

describe('reviewer/+page.server.ts action review', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('enregistre la review et fait passer l’article en ACCEPTED', async () => {
		mockSelectRows([{ id: 'art-1', status: 'SUBMITTED' }]);
		const values = mockInsert();
		const set = mockUpdate();

		const result = await actions.review({
			request: formDataRequest({
				articleId: 'art-1',
				decision: 'ACCEPT',
				comment: 'Bon article'
			}),
			locals: { user: { id: 'reviewer-1', role: 'REVIEWER' } }
		} as never);

		expect(values).toHaveBeenCalledWith(
			expect.objectContaining({ articleId: 'art-1', decision: 'ACCEPT' })
		);
		expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: 'ACCEPTED' }));
		expect(result).toEqual({ success: true, message: 'Review enregistrée' });
	});

	it('enregistre la review et fait passer l’article en REJECTED', async () => {
		mockSelectRows([{ id: 'art-1', status: 'SUBMITTED' }]);
		const values = mockInsert();
		const set = mockUpdate();

		const result = await actions.review({
			request: formDataRequest({
				articleId: 'art-1',
				decision: 'REJECT',
				comment: 'Article insuffisant'
			}),
			locals: { user: { id: 'reviewer-1', role: 'REVIEWER' } }
		} as never);

		expect(values).toHaveBeenCalledWith(
			expect.objectContaining({ articleId: 'art-1', decision: 'REJECT' })
		);
		expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: 'REJECTED' }));
		expect(result).toEqual({ success: true, message: 'Review enregistrée' });
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			actions.review({
				request: formDataRequest({ articleId: 'art-1', decision: 'ACCEPT', comment: 'ok' }),
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est ni reviewer ni admin', async () => {
		await expect(
			actions.review({
				request: formDataRequest({ articleId: 'art-1', decision: 'ACCEPT', comment: 'ok' }),
				locals: { user: { id: 'user-1', role: 'USER' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('refuse une soumission sans articleId, decision ou comment', async () => {
		const result = await actions.review({
			request: formDataRequest({ articleId: '', decision: '', comment: '' }),
			locals: { user: { id: 'reviewer-1', role: 'REVIEWER' } }
		} as never);

		expect(result).toMatchObject({ status: 400, data: { message: 'Données manquantes' } });
	});

	it('refuse de reviewer un article déjà traité', async () => {
		mockSelectRows([{ id: 'art-1', status: 'ACCEPTED' }]);

		const result = await actions.review({
			request: formDataRequest({ articleId: 'art-1', decision: 'ACCEPT', comment: 'ok' }),
			locals: { user: { id: 'reviewer-1', role: 'REVIEWER' } }
		} as never);

		expect(result).toMatchObject({
			status: 400,
			data: { message: expect.stringContaining('ACCEPTED') }
		});
	});

	it('renvoie une 404 si l’article n’existe pas', async () => {
		mockSelectRows([]);

		await expect(
			actions.review({
				request: formDataRequest({ articleId: 'inconnu', decision: 'ACCEPT', comment: 'ok' }),
				locals: { user: { id: 'reviewer-1', role: 'REVIEWER' } }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});
});
