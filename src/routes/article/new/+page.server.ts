import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { articleSchema } from './schema';
import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const form = await superValidate(zod4(articleSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const sessionUser = event.locals.user;
		if (!sessionUser) throw redirect(302, '/login');

		const form = await superValidate(event, zod4(articleSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.insert(article).values({
				title: form.data.title,
				excerpt: form.data.excerpt,
				content: form.data.content,
				authorId: sessionUser.id
			});
		} catch (error) {
			console.error("Erreur d'insertion DB:", error);
			return fail(500, { form, message: "Erreur lors de la sauvegarde de l'article." });
		}

		throw redirect(302, '/');
	}
};