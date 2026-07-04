import { fail, redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { articleSchema } from '../../new/schema';
import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	const articleId = params.id;
	const [existingArticle] = await db.select().from(article).where(eq(article.id, articleId)).limit(1);

	if (!existingArticle) throw error(404, 'Article non trouvé');
	if (existingArticle.authorId !== locals.user.id) throw error(403, 'Vous n\'êtes pas autorisé à modifier cet article');
	if (existingArticle.status !== 'DRAFT') throw error(403, 'Seuls les brouillons peuvent être modifiés');

	const form = await superValidate({ title: existingArticle.title, excerpt: existingArticle.excerpt, content: existingArticle.content }, zod4(articleSchema));
	return { form, articleId };
};

export const actions: Actions = {
	default: async (event) => {
		const sessionUser = event.locals.user;
		if (!sessionUser) throw redirect(302, '/login');

		const form = await superValidate(event, zod4(articleSchema));
		if (!form.valid) return fail(400, { form });

		const articleId = event.params.id;
		const [existingArticle] = await db.select().from(article).where(eq(article.id, articleId)).limit(1);

		if (!existingArticle) throw error(404, 'Article non trouvé');
		if (existingArticle.authorId !== sessionUser.id) throw error(403, 'Vous n\'êtes pas autorisé à modifier cet article');
		if (existingArticle.status !== 'DRAFT') throw error(403, 'Seuls les brouillons peuvent être modifiés');

		try {
			await db.update(article).set({
				title: form.data.title,
				excerpt: form.data.excerpt,
				content: form.data.content,
				updatedAt: new Date()
			}).where(eq(article.id, articleId));
		} catch (error) {
			console.error("Erreur de mise à jour DB:", error);
			return fail(500, { form, message: "Erreur lors de la mise à jour de l'article." });
		}

		throw redirect(302, `/article/${articleId}`);
	}
};
