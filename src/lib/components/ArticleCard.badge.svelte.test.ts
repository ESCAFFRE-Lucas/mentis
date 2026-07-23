import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import ArticleCard from './ArticleCard.svelte';

describe('ArticleCard - badge de validation', () => {
	afterEach(() => {
		cleanup();
	});

	const mockArticle = {
		id: 'tech-123',
		title: 'Pourquoi Svelte 5 change la donne',
		excerpt: 'Une analyse détaillée des Runes et de la nouvelle réactivité...',
		author: { id: 'user-1', name: 'Lucas Escaffre' },
		createdAt: new Date('2026-03-26T10:00:00')
	};

	it('affiche le badge "Validé par un expert" pour tout article rendu par ce composant', () => {
		render(ArticleCard, { props: { article: mockArticle } });

		expect(screen.getByText('✓ Validé par un expert')).toBeTruthy();
	});
});
