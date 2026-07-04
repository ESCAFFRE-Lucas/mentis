import { db } from '$lib/server/db';
import { user, article } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, count } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sessionUser = locals.user;
	if (!sessionUser) throw redirect(302, '/login');
	if (sessionUser.role !== 'ADMIN') throw error(403, 'Accès réservé aux administrateurs');

	const users = await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		reputationScore: user.reputationScore,
		createdAt: user.createdAt
	}).from(user).orderBy(user.createdAt);

	const articleStats = await db.select({
		status: article.status,
		count: count()
	}).from(article).groupBy(article.status);

	const stats = { DRAFT: 0, SUBMITTED: 0, UNDER_REVIEW: 0, ACCEPTED: 0, REJECTED: 0, ARCHIVED: 0 };
	articleStats.forEach((stat) => {
		stats[stat.status as keyof typeof stats] = stat.count;
	});

	return { users, stats };
};

export const actions: Actions = {
	updateRole: async ({ request, locals }) => {
		const sessionUser = locals.user;
		if (!sessionUser) throw redirect(302, '/login');
		if (sessionUser.role !== 'ADMIN') throw error(403, 'Accès réservé aux administrateurs');

		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const newRole = formData.get('role') as string;

		if (!userId || !newRole) return fail(400, { message: 'Données manquantes' });
		if (!['USER', 'REVIEWER', 'ADMIN'].includes(newRole)) return fail(400, { message: 'Rôle invalide' });

		await db.update(user).set({ role: newRole }).where(eq(user.id, userId));
		return { success: true, message: `Rôle mis à jour avec succès` };
	}
};
