import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import ArticleCard from './ArticleCard.svelte';

describe('Composant ArticleCard', () => {

	afterEach(() => {
		cleanup();
	});

	const mockArticle = {
		id: 'tech-123',
		title: 'Pourquoi Svelte 5 change la donne',
		excerpt: 'Une analyse détaillée des Runes et de la nouvelle réactivité...',
		author: { name: 'Lucas Escaffre' },
		createdAt: new Date('2026-03-26T10:00:00'),
		likesCount: 42,
		commentsCount: 7
	};

	it('1. Doit afficher correctement le contenu texte de l\'article', () => {
		render(ArticleCard, { props: { article: mockArticle } });

		expect(screen.getByText('Pourquoi Svelte 5 change la donne')).toBeTruthy();
		expect(screen.getByText(/Une analyse détaillée des Runes/i)).toBeTruthy();
		expect(screen.getByText('Lucas Escaffre')).toBeTruthy();
		expect(screen.getByText('42')).toBeTruthy();
	});

	it('2. Doit générer le bon lien de redirection', () => {
		render(ArticleCard, { props: { article: mockArticle } });

		const link = screen.getByRole('link', { name: 'Pourquoi Svelte 5 change la donne' }) as HTMLAnchorElement;

		expect(link.getAttribute('href')).toBe('/article/tech-123');
	});
});