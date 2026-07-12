import { redirect, error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { article, user, review } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sessionUser = locals.user;
	if (!sessionUser) {
		throw redirect(302, '/login');
	}

	if (sessionUser.role !== 'REVIEWER' && sessionUser.role !== 'ADMIN') {
		throw error(403, 'Accès réservé aux reviewers');
	}

	const submittedArticles = await db
		.select({
			id: article.id,
			title: article.title,
			excerpt: article.excerpt,
			status: article.status,
			createdAt: article.createdAt,
			authorId: article.authorId,
			authorName: user.name
		})
		.from(article)
		.innerJoin(user, eq(article.authorId, user.id))
		.where(eq(article.status, 'SUBMITTED'))
		.orderBy(desc(article.createdAt));

	return { articles: submittedArticles, user: sessionUser };
};

export const actions: Actions = {
	review: async ({ request, locals }) => {
		const sessionUser = locals.user;
		if (!sessionUser) {
			throw redirect(302, '/login');
		}

		if (sessionUser.role !== 'REVIEWER' && sessionUser.role !== 'ADMIN')
			throw error(403, 'Accès réservé aux reviewers');

		const formData = await request.formData();
		const articleId = formData.get('articleId') as string;
		const decision = formData.get('decision') as 'ACCEPT' | 'REJECT';
		const comment = formData.get('comment') as string;

		if (!articleId || !decision || !comment) return fail(400, { message: 'Données manquantes' });

		const [existingArticle] = await db
			.select({ id: article.id, status: article.status })
			.from(article)
			.where(eq(article.id, articleId))
			.limit(1);
		if (!existingArticle) throw error(404, 'Article non trouvé');
		if (existingArticle.status !== 'SUBMITTED')
			return fail(400, {
				message: `L'article est en statut ${existingArticle.status}, impossible de le reviewer`
			});

		const newStatus = decision === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';

		await db.insert(review).values({ articleId, reviewerId: sessionUser.id, decision, comment });
		await db
			.update(article)
			.set({ status: newStatus, updatedAt: new Date() })
			.where(eq(article.id, articleId));

		return { success: true, message: 'Review enregistrée' };
	}
};
