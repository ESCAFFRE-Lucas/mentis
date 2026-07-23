import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import Navbar from './Navbar.svelte';

describe('Composant Navbar', () => {
	afterEach(() => {
		cleanup();
	});

	it('affiche les liens de connexion quand aucun utilisateur n’est connecté', () => {
		render(Navbar, { props: { user: null } });

		expect(screen.getByRole('link', { name: 'Se connecter' })).toBeTruthy();
		expect(screen.getByRole('link', { name: "S'inscrire" })).toBeTruthy();
		expect(screen.queryByRole('link', { name: 'Créer un article' })).toBeNull();
	});

	it('affiche le menu utilisateur quand un utilisateur est connecté', () => {
		render(Navbar, {
			props: {
				user: { name: 'Lucas Escaffre', email: 'lucas@mentis.com', role: 'USER' }
			}
		});

		expect(screen.getByRole('link', { name: 'Créer un article' })).toBeTruthy();
		expect(screen.queryByRole('link', { name: 'Se connecter' })).toBeNull();
		expect(screen.queryByRole('link', { name: 'Interface Reviewer' })).toBeNull();
		expect(screen.queryByRole('link', { name: 'Admin' })).toBeNull();
	});

	it('affiche le lien Reviewer pour un rôle REVIEWER mais pas le lien Admin', () => {
		render(Navbar, {
			props: {
				user: { name: 'Rita Reviewer', email: 'rita@mentis.com', role: 'REVIEWER' }
			}
		});

		expect(screen.getByRole('link', { name: 'Interface Reviewer' })).toBeTruthy();
		expect(screen.queryByRole('link', { name: 'Admin' })).toBeNull();
	});

	it('affiche le lien Admin pour un rôle ADMIN', () => {
		render(Navbar, {
			props: {
				user: { name: 'Alice Admin', email: 'alice@mentis.com', role: 'ADMIN' }
			}
		});

		expect(screen.getByRole('link', { name: 'Admin' })).toBeTruthy();
	});
});
