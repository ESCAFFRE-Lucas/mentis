<script lang="ts">
	import type { PageData } from './$types';
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	let { data }: { data: PageData } = $props();

</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Fil d'actualité</h1>
	<p class="text-zinc-500 mt-2">Découvrez les derniers articles publiés par la communauté.</p>
</div>

{#if data.user}
	<div class="mb-8 p-6 border rounded-xl bg-white shadow-sm flex items-center justify-between">
		<div>
			<p class="font-medium text-zinc-900">Bonjour {data.user.name} 👋</p>
			<p class="text-sm text-zinc-500">Prêt à partager quelque chose aujourd'hui ?</p>
		</div>
		<a href="/article/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
			Créer un article
		</a>
	</div>
{:else}
	<div class="mb-8 p-6 bg-zinc-100 rounded-xl text-center">
		<p class="mb-4 text-zinc-700">Rejoignez la communauté Mentis pour publier et réagir aux articles !</p>
		<a href="/register" class="inline-block bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2 rounded-md font-medium transition-colors">S'inscrire</a>
	</div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	{#each data.articles as article (article.id)}
		<ArticleCard {article} />
	{/each}
</div>

{#if data.articles.length === 0}
	<div class="text-center py-12 text-zinc-500">
		Aucun article pour le moment. Soyez le premier à en écrire un !
	</div>
{/if}