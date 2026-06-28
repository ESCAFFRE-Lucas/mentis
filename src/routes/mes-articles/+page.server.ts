import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sessionUser = locals.user;
	if (!sessionUser) {
		throw redirect(302, '/login');
	}

	const userArticles = await db
		.select({
			id: article.id,
			title: article.title,
			excerpt: article.excerpt,
			status: article.status,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt
		})
		.from(article)
		.where(eq(article.authorId, sessionUser.id))
		.orderBy(desc(article.createdAt));

	return {
		articles: userArticles,
		user: sessionUser
	};
};
