<script lang="ts">
	import type { PageData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';

	let { data }: { data: PageData } = $props();

	const article = data.article;
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<a href="/" class="mb-8 inline-block text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
		← Retour au fil d'actualité
	</a>

	{#if article}
		<article>
			<header class="mb-8">
				<h1 class="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 md:text-5xl">
					{article.title}
				</h1>

				<div class="flex items-center gap-3 border-b border-zinc-100 pb-8">
					<Avatar.Root class="h-10 w-10">
						<Avatar.Fallback class="bg-zinc-900 text-white font-bold">
							{article.authorName ? article.authorName[0].toUpperCase() : '?'}
						</Avatar.Fallback>
					</Avatar.Root>
					<div>
						<p class="text-sm font-semibold text-zinc-900">{article.authorName}</p>
						<p class="text-xs text-zinc-500">
							Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})}
						</p>
					</div>
				</div>
			</header>

			<div class="prose prose-zinc max-w-none lg:prose-lg">
				{#each article.content.split('\n') as paragraph, i (i)}
					{#if paragraph.trim()}
						<p class="text-zinc-700 text-lg leading-relaxed mb-6">
							{paragraph}
						</p>
					{/if}
				{/each}
			</div>
		</article>
	{:else}
		<p class="text-center text-zinc-500">Chargement de l'article...</p>
	{/if}
</div>