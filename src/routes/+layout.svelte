<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutData } from '../../.svelte-kit/types/src/routes/$types';
	import type { Snippet } from 'svelte';
	import { page } from "$app/state";

	injectSpeedInsights();

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let hideNavbar = $derived(
		page.url.pathname === '/login' || page.url.pathname === '/register'
	);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-zinc-50 flex flex-col">
	{#if !hideNavbar}
		<Navbar user={data.user} />
	{/if}

	<main class="flex-1 container mx-auto max-w-5xl p-4">
		{@render children()}
	</main>
</div>
