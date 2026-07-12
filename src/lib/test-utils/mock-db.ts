import { vi } from 'vitest';

/**
 * Mock Drizzle partagé pour les tests de server actions.
 * Usage :
 *   vi.mock('$lib/server/db', () => ({ db: mockDb }));
 *   ...
 *   mockSelectRows([{ id: 'art-1', status: 'DRAFT' }]);
 */
export const mockDb = {
	select: vi.fn(),
	update: vi.fn(),
	insert: vi.fn()
};

/**
 * SvelteKit type ses `PageServerLoad` avec `void` dans l'union de retour
 * (cas où `load` ne renverrait rien). En pratique nos `load` renvoient
 * toujours un objet ; ce helper évite de répéter le cast dans chaque test.
 */
export async function awaitLoadData<T>(result: T | void): Promise<T> {
	return result as T;
}

function resolvedWhereLimit(rows: unknown[]) {
	return {
		from: () => ({
			where: () => ({
				limit: () => Promise.resolve(rows)
			})
		})
	};
}

export function resetMockDb() {
	mockDb.select.mockReset();
	mockDb.update.mockReset();
	mockDb.insert.mockReset();
}

/** Fait renvoyer à `db.select(...).from(...).where(...).limit(...)` les lignes données. */
export function mockSelectRows(rows: unknown[]) {
	mockDb.select.mockReturnValue(resolvedWhereLimit(rows));
}

/** Fait renvoyer à `db.select(...).from(...).innerJoin(...).where(...).orderBy(...)` les lignes données. */
export function mockSelectJoinedRows(rows: unknown[]) {
	mockDb.select.mockReturnValue({
		from: () => ({
			innerJoin: () => ({
				where: () => ({
					orderBy: () => Promise.resolve(rows)
				})
			})
		})
	});
}

/** Configure `db.update(...).set(...).where(...)` et retourne le spy sur `.set` pour les assertions. */
export function mockUpdate() {
	const set = vi.fn().mockReturnValue({
		where: () => Promise.resolve(undefined)
	});
	mockDb.update.mockReturnValue({ set });
	return set;
}

/** Configure `db.insert(...).values(...)` et retourne le spy sur `.values` pour les assertions. */
export function mockInsert() {
	const values = vi.fn().mockReturnValue(Promise.resolve(undefined));
	mockDb.insert.mockReturnValue({ values });
	return values;
}

/** Construit un objet `request`-like avec un `.formData()` prêt à l'emploi pour les actions. */
export function formDataRequest(fields: Record<string, string>) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	return { formData: () => Promise.resolve(formData) };
}

/**
 * Construit une vraie instance `Request` avec un body `FormData`.
 * Nécessaire pour les actions qui passent par `superValidate(event, ...)` :
 * sveltekit-superforms vérifie `request instanceof Request` avant de lire le formData,
 * un simple objet `{ formData() }` échoue ce check et produit un formulaire vide.
 */
export function realFormDataRequest(fields: Record<string, string>) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	return new Request('http://localhost/', { method: 'POST', body: formData });
}
