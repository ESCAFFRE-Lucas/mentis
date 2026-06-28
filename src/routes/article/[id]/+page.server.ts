import { db } from '$lib/server/db';
import { article, user } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const articleId = params.id;

	const result = await db
		.select({
			id: article.id,
			title: article.title,
			content: article.content,
			status: article.status,
			authorId: article.authorId,
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
		article: result[0],
		user: locals.user
	};
};

export const actions: Actions = {
	submit: async ({ params, locals }) => {
		const sessionUser = locals.user;
		if (!sessionUser) {
			throw redirect(302, '/login');
		}

		const articleId = params.id;

		const [existingArticle] = await db
			.select({
				id: article.id,
				status: article.status,
				authorId: article.authorId
			})
			.from(article)
			.where(eq(article.id, articleId))
			.limit(1);

		if (!existingArticle) {
			throw error(404, 'Article non trouvé');
		}

		if (existingArticle.authorId !== sessionUser.id) {
			throw error(403, 'Vous n\'êtes pas autorisé à soumettre cet article');
		}

		if (existingArticle.status !== 'DRAFT') {
			return fail(400, {
				message: `L'article est déjà en statut ${existingArticle.status}`
			});
		}

		await db
			.update(article)
			.set({ status: 'SUBMITTED', updatedAt: new Date() })
			.where(eq(article.id, articleId));

		return { success: true, message: 'Article soumis pour review' };
	}
};
