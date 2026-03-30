import { describe, it, expect } from 'vitest';
import { articleSchema } from './schema';

describe('Validation du Schéma Article', () => {
	it('doit valider un article correct', () => {
		const validArticle = {
			title: 'Mon super titre Svelte',
			excerpt: 'Un petit résumé de plus de dix caractères.',
			content:
				'Voici un contenu d’article assez long pour passer la validation de vingt caractères.'
		};

		const result = articleSchema.safeParse(validArticle);
		expect(result.success).toBe(true);
	});

	it('doit refuser un titre trop court', () => {
		const invalidArticle = {
			title: 'A',
			excerpt: 'Un résumé valide ici',
			content: 'Contenu valide de plus de vingt caractères.'
		};

		const result = articleSchema.safeParse(invalidArticle);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Le titre doit faire au moins 5 caractères');
		}
	});

	it('doit refuser un contenu trop court', () => {
		const invalidArticle = {
			title: 'Titre Valide',
			excerpt: 'Résumé valide ici',
			content: 'Court'
		};

		const result = articleSchema.safeParse(invalidArticle);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('trop court');
		}
	});
});
