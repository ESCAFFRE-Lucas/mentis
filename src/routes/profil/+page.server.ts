import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sessionUser = locals.user;
	if (!sessionUser) throw redirect(302, '/login');

	const articleStats = await db.select({
		status: article.status,
		count: count()
	}).from(article).where(eq(article.authorId, sessionUser.id)).groupBy(article.status);

	const stats = { DRAFT: 0, SUBMITTED: 0, UNDER_REVIEW: 0, ACCEPTED: 0, REJECTED: 0, ARCHIVED: 0 };
	articleStats.forEach((stat) => {
		stats[stat.status as keyof typeof stats] = stat.count;
	});

	return { user: sessionUser, stats };
};
