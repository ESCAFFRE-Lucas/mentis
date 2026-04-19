import { db } from '$lib/server/db';
import { article, user } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { deleteArticleSchema } from './schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const articleId = params.id;

	const result = await db
		.select({
			id: article.id,
			title: article.title,
			content: article.content,
			createdAt: article.createdAt,
			authorId: article.authorId,
			authorName: user.name
		})
		.from(article)
		.where(eq(article.id, articleId))
		.innerJoin(user, eq(article.authorId, user.id))
		.limit(1);

	if (result.length === 0) {
		throw error(404, 'Article non trouvé');
	}

	const form = await superValidate({ id: result[0].id }, zod4(deleteArticleSchema));

	return {
		article: result[0],
		user: locals.user,
		form
	};
};

export const actions: Actions = {
	deleteArticle: async ({ params, locals }) => {
		const session = locals.user;

		if (!session) {
			throw error(401, 'Vous devez être connecté pour supprimer un article');
		}

		const [targetArticle] = await db
			.select()
			.from(article)
			.where(eq(article.id, params.id))
			.limit(1);

		if (!targetArticle) {
			throw error(404, 'Article introuvable');
		}

		if (targetArticle.authorId !== session.id) {
			throw error(403, 'Vous n’avez pas le droit de supprimer cet article');
		}

		await db.delete(article).where(eq(article.id, params.id));

		throw redirect(303, '/');
	}
};
