<script lang="ts">
	import type { PageData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';

	let { data }: { data: PageData } = $props();
	const { article } = data;
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<a href="/" class="mb-8 inline-block text-sm text-zinc-500 hover:text-zinc-900">
		← Retour au fil d'actualité
	</a>

	<article>
		<header class="mb-8">
			<h1 class="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900">
				{article.title}
			</h1>

			<div class="flex items-center gap-3">
				<Avatar.Root class="h-10 w-10">
					<Avatar.Fallback>{article.authorName[0]}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<p class="text-sm font-medium text-zinc-900">{article.authorName}</p>
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

		<div class="prose max-w-none prose-zinc lg:prose-lg">
			{#each article.content.split('\n') as paragraph (paragraph)}
				{#if paragraph.trim()}
					<p class="mb-4 leading-relaxed text-zinc-700">{paragraph}</p>
				{/if}
			{/each}
		</div>
	</article>
</div>
