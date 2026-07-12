<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { STATUS_LABELS, STATUS_COLORS } from '$lib/utils/status';

	let { data }: { data: PageData } = $props();
</script>

<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-zinc-900">
				Articles {STATUS_LABELS[data.status]}
			</h1>
			<p class="mt-2 text-zinc-500">
				{data.articles.length} article{data.articles.length > 1 ? 's' : ''} dans ce statut.
			</p>
		</div>
		<Button href="/admin" variant="outline">← Retour au dashboard</Button>
	</div>
</div>

{#if data.articles.length === 0}
	<div class="rounded-xl border bg-white p-12 text-center shadow-sm">
		<p class="text-zinc-700">Aucun article dans ce statut.</p>
	</div>
{:else}
	<div class="space-y-4">
		{#each data.articles as article (article.id)}
			<a
				href="/article/{article.id}"
				class="block rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
			>
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						<h2 class="mb-2 text-xl font-bold text-zinc-900">{article.title}</h2>
						<p class="mb-3 text-sm text-zinc-600">{article.excerpt}</p>
						<div class="flex items-center gap-4 text-xs text-zinc-500">
							<span>Par {article.authorName}</span>
							<span
								>Créé le {new Date(article.createdAt).toLocaleDateString('fr-FR', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}</span
							>
							{#if article.updatedAt.getTime() !== article.createdAt.getTime()}
								<span
									>Mis à jour le {new Date(article.updatedAt).toLocaleDateString('fr-FR', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}</span
								>
							{/if}
						</div>
					</div>
					<span
						class="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap {STATUS_COLORS[
							article.status
						]}">{STATUS_LABELS[article.status]}</span
					>
				</div>
			</a>
		{/each}
	</div>
{/if}
