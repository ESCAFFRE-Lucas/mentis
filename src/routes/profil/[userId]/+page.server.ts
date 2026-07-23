import { db } from '$lib/server/db';
import { user, article } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq, and, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const userId = params.userId;

	const [profileUser] = await db
		.select({
			id: user.id,
			name: user.name,
			role: user.role,
			reputationScore: user.reputationScore,
			createdAt: user.createdAt
		})
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);

	if (!profileUser) throw error(404, 'Utilisateur non trouvé');

	const acceptedArticles = await db
		.select({
			id: article.id,
			title: article.title,
			excerpt: article.excerpt,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt
		})
		.from(article)
		.where(and(eq(article.authorId, userId), eq(article.status, 'ACCEPTED')))
		.orderBy(article.createdAt);

	const [articleCount] = await db
		.select({ count: count() })
		.from(article)
		.where(and(eq(article.authorId, userId), eq(article.status, 'ACCEPTED')));

	return { profileUser, articles: acceptedArticles, articleCount: articleCount.count };
};
