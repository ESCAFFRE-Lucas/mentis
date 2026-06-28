<script lang="ts">
	import type { PageData } from './$types';
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Fil d'actualité</h1>
	<p class="mt-2 text-zinc-500">Découvrez les derniers articles publiés par la communauté.</p>
</div>

{#if data.user}
	<div class="mb-8 flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
		<div>
			<p class="font-medium text-zinc-900">Bonjour {data.user.name} 👋</p>
			<p class="text-sm text-zinc-500">Prêt à partager quelque chose aujourd'hui ?</p>
		</div>
		<a
			href="/article/new"
			class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
		>
			Créer un article
		</a>
	</div>
{:else}
	<div class="mb-8 rounded-xl bg-zinc-100 p-6 text-center">
		<p class="mb-4 text-zinc-700">
			Rejoignez la communauté Mentis pour publier et réagir aux articles !
		</p>
		<a
			href="/register"
			class="inline-block rounded-md bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800"
			>S'inscrire</a
		>
	</div>
{/if}

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
	{#each data.articles as article (article.id)}
		<ArticleCard {article} />
	{/each}
</div>

{#if data.articles.length === 0}
	<div class="py-12 text-center text-zinc-500">
		Aucun article pour le moment. Soyez le premier à en écrire un !
	</div>
{/if}
