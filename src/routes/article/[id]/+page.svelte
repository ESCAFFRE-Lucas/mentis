<script lang="ts">
	import type { PageData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { STATUS_LABELS, STATUS_COLORS, DECISION_LABELS, DECISION_COLORS } from '$lib/utils/status';

	let { data }: { data: PageData } = $props();
	const { article, reviews, user } = data;
	const isAuthor = user?.id === article.authorId;
	const canSubmit = isAuthor && article.status === 'DRAFT';
	const canRestore = isAuthor && article.status === 'ARCHIVED';

	const goBack = () => {
		if (typeof window !== 'undefined' && window.history.length > 1) {
			window.history.back();
		} else {
			goto('/');
		}
	};
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<button onclick={goBack} class="mb-8 text-sm font-medium text-zinc-500 hover:text-zinc-900">
		← Retour
	</button>
	{#if article}
		<article>
			<header class="mb-8">
				<h1 class="mb-4 text-4xl font-bold text-zinc-900 md:text-5xl">{article.title}</h1>
				<div class="flex items-center gap-3 border-b pb-8">
					<Avatar.Root class="h-10 w-10">
						<Avatar.Fallback class="bg-zinc-900 text-white font-bold">
							{article.authorName?.[0]?.toUpperCase() ?? '?'}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex-1">
						<a href="/profil/{article.authorId}" class="text-sm font-semibold hover:text-blue-600 hover:underline">{article.authorName}</a>
						<p class="text-xs text-zinc-500">
							{new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
						</p>
					</div>
					<div class="flex items-center gap-3">
						<span class="text-xs font-medium px-2.5 py-1 rounded-full {STATUS_COLORS[article.status] || 'bg-gray-100 text-gray-700'}">
							{STATUS_LABELS[article.status] || article.status}
						</span>
						{#if canSubmit}
							<Button href="/article/{article.id}/edit" variant="outline" size="sm">Modifier</Button>
							<form method="POST" action="?/archive" use:enhance>
								<Button type="submit" variant="outline" size="sm">Archiver</Button>
							</form>
							<form method="POST" action="?/submit" use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') await invalidateAll();
								};
							}}>
								<Button type="submit" size="sm" class="bg-primary">Soumettre pour review</Button>
							</form>
						{/if}
						{#if canRestore}
							<form method="POST" action="?/restore" use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										await invalidateAll();
										window.location.reload();
									}
								};
							}}>
								<Button type="submit" variant="outline" size="sm">Restaurer en brouillon</Button>
							</form>
						{/if}
					</div>
				</div>
			</header>
			<div class="prose max-w-none">
				{#each article.content.split('\n') as paragraph, i (i)}
					{#if paragraph.trim()}
						<p class="text-zinc-700 mb-4">{paragraph}</p>
					{/if}
				{/each}
			</div>

			{#if reviews.length > 0}
				<div class="mt-12 border-t pt-8">
					<h2 class="mb-4 text-2xl font-bold">Reviews ({reviews.length})</h2>
					<div class="space-y-3">
						{#each reviews as r (r.id)}
							<div class="border rounded-lg bg-zinc-50 p-4">
								<div class="flex items-center justify-between mb-2">
									<div class="flex items-center gap-2">
										<Avatar.Root class="h-8 w-8">
											<Avatar.Fallback class="bg-zinc-700 text-white text-xs font-bold">
												{r.reviewerName?.[0]?.toUpperCase() ?? 'R'}
											</Avatar.Fallback>
										</Avatar.Root>
										<div>
											<p class="text-sm font-semibold">{r.reviewerName}</p>
											<p class="text-xs text-zinc-500">
												{new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
											</p>
										</div>
									</div>
									<span class="px-3 py-1 text-xs font-medium rounded-full {DECISION_COLORS[r.decision] || 'bg-gray-100 text-gray-700'}">
										{DECISION_LABELS[r.decision] || r.decision}
									</span>
								</div>
								<p class="text-sm text-zinc-700">{r.comment}</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</article>
	{:else}
		<p class="text-center text-zinc-500">Chargement de l'article...</p>
	{/if}
</div>