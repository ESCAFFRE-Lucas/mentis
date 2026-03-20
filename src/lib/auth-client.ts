import { createAuthClient } from 'better-auth/svelte';
import { browser } from '$app/environment'; // L'outil magique de SvelteKit

export const authClient = createAuthClient({
	baseURL: browser ? window.location.origin : (import.meta.env.VITE_BETTER_AUTH_URL || "")
});

export const { signIn, signUp, signOut, useSession } = authClient;