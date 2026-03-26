import { db } from '$lib/server/db';
import { article, user } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const rawArticles = await db
		.select({
			id: article.id,
			title: article.title,
			excerpt: article.excerpt,
			createdAt: article.createdAt,
			authorName: user.name,
		})
		.from(article)
		.innerJoin(user, eq(article.authorId, user.id))
		.orderBy(desc(article.createdAt));

	const articles = rawArticles.map(a => ({
		id: a.id,
		title: a.title,
		excerpt: a.excerpt,
		createdAt: a.createdAt,
		author: { name: a.authorName },
		likesCount: 0,
		commentsCount: 0
	}));

	return {
		user: event.locals.user,
		articles
	};
};