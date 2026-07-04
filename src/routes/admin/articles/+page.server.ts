import { db } from '$lib/server/db';
import { article, user } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const sessionUser = locals.user;
	if (!sessionUser) throw redirect(302, '/login');
	if (sessionUser.role !== 'ADMIN') throw error(403, 'Accès réservé aux administrateurs');

	const status = url.searchParams.get('status');
	if (!status || !['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'ARCHIVED'].includes(status)) throw redirect(302, '/admin');

	const articles = await db.select({
		id: article.id,
		title: article.title,
		excerpt: article.excerpt,
		status: article.status,
		createdAt: article.createdAt,
		updatedAt: article.updatedAt,
		authorId: article.authorId,
		authorName: user.name
	}).from(article).where(eq(article.status, status)).innerJoin(user, eq(article.authorId, user.id)).orderBy(article.updatedAt);

	return { articles, status };
};
