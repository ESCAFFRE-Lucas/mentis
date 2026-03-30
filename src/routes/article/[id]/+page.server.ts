import { db } from '$lib/server/db';
import { article, user } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const articleId = params.id;

	const result = await db
		.select({
			id: article.id,
			title: article.title,
			content: article.content,
			createdAt: article.createdAt,
			authorName: user.name
		})
		.from(article)
		.where(eq(article.id, articleId))
		.innerJoin(user, eq(article.authorId, user.id))
		.limit(1);

	if (result.length === 0) {
		throw error(404, 'Article non trouvé');
	}

	return {
		article: result[0]
	};
};
