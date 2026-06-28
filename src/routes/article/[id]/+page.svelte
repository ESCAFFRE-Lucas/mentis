<script lang="ts">
	import type { PageData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const article = data.article;
	const user = data.user;

	const isAuthor = user?.id === article.authorId;
	const canSubmit = isAuthor && article.status === 'DRAFT';

	const goBack = () => {
		if (isAuthor) {
			goto('/mes-articles');
		} else {
			goto('/');
		}
	};

	function translateStatus(status: string) {
		switch (status) {
			case 'DRAFT':
				return 'Brouillon';
			case 'SUBMITTED':
				return 'Soumis';
			case 'UNDER_REVIEW':
				return 'En révision';
			case 'ACCEPTED':
				return 'Accepté';
			case 'REJECTED':
				return 'Rejeté';
			default:
				return status;
		}
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<button
		onclick={goBack}
		class="mb-8 inline-block text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
	>
		← Retour {isAuthor ? 'à mes articles' : 'au fil d\'actualité'}
	</button>

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
					<div class="flex-1">
						<p class="text-sm font-semibold text-zinc-900">{article.authorName}</p>
						<p class="text-xs text-zinc-500">
							Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})}
						</p>
					</div>
					<div class="flex items-center gap-3">
						<span class="text-xs font-medium px-2.5 py-1 rounded-full {
							article.status === 'DRAFT' ? 'bg-zinc-100 text-zinc-700' :
							article.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
							article.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
							article.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
							'bg-red-100 text-red-700'
						}">
							{translateStatus(article.status)}
						</span>
						{#if canSubmit}
							<form method="POST" action="?/submit" use:enhance>
								<Button type="submit" size="sm" class="bg-primary">
									Soumettre pour review
								</Button>
							</form>
						{/if}
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