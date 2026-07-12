import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDb, resetMockDb, mockUpdate, formDataRequest } from '$lib/test-utils/mock-db';

vi.mock('$lib/server/db', () => ({ db: mockDb }));

import { actions } from './+page.server';

describe('admin/+page.server.ts action updateRole', () => {
	beforeEach(() => {
		resetMockDb();
	});

	it('met à jour le rôle de l’utilisateur quand l’appelant est admin', async () => {
		const set = mockUpdate();

		const result = await actions.updateRole({
			request: formDataRequest({ userId: 'user-1', role: 'REVIEWER' }),
			locals: { user: { id: 'admin-1', role: 'ADMIN' } }
		} as never);

		expect(set).toHaveBeenCalledWith({ role: 'REVIEWER' });
		expect(result).toEqual({ success: true, message: 'Rôle mis à jour avec succès' });
	});

	it('redirige vers /login si aucune session active', async () => {
		await expect(
			actions.updateRole({
				request: formDataRequest({ userId: 'user-1', role: 'REVIEWER' }),
				locals: { user: null }
			} as never)
		).rejects.toMatchObject({ status: 302, location: '/login' });
	});

	it('refuse avec un 403 si l’appelant n’est pas admin', async () => {
		await expect(
			actions.updateRole({
				request: formDataRequest({ userId: 'user-1', role: 'REVIEWER' }),
				locals: { user: { id: 'user-1', role: 'USER' } }
			} as never)
		).rejects.toMatchObject({ status: 403 });
	});

	it('refuse une soumission sans userId ni role', async () => {
		const result = await actions.updateRole({
			request: formDataRequest({ userId: '', role: '' }),
			locals: { user: { id: 'admin-1', role: 'ADMIN' } }
		} as never);

		expect(result).toMatchObject({ status: 400, data: { message: 'Données manquantes' } });
	});

	it('refuse un rôle inconnu', async () => {
		const result = await actions.updateRole({
			request: formDataRequest({ userId: 'user-1', role: 'SUPERADMIN' }),
			locals: { user: { id: 'admin-1', role: 'ADMIN' } }
		} as never);

		expect(result).toMatchObject({ status: 400, data: { message: 'Rôle invalide' } });
	});
});
