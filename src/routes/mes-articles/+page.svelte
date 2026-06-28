<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageData } = $props();

	function getStatusBadgeClass(status: string) {
		switch (status) {
			case 'DRAFT':
				return 'bg-zinc-100 text-zinc-700';
			case 'SUBMITTED':
				return 'bg-blue-100 text-blue-700';
			case 'UNDER_REVIEW':
				return 'bg-yellow-100 text-yellow-700';
			case 'ACCEPTED':
				return 'bg-green-100 text-green-700';
			case 'REJECTED':
				return 'bg-red-100 text-red-700';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	}

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

<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Mes articles</h1>
			<p class="mt-2 text-zinc-500">Gérez tous vos articles publiés et brouillons.</p>
		</div>
		<Button href="/article/new" class="bg-primary">Créer un article</Button>
	</div>
</div>

{#if data.articles.length === 0}
	<div class="rounded-xl border bg-white p-12 text-center shadow-sm">
		<p class="mb-4 text-zinc-700">Vous n'avez pas encore écrit d'article.</p>
		<Button href="/article/new" class="bg-primary">Créer votre premier article</Button>
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
							<span>
								Créé le {new Date(article.createdAt).toLocaleDateString('fr-FR', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
							</span>
							{#if article.updatedAt.getTime() !== article.createdAt.getTime()}
								<span>
									Mis à jour le {new Date(article.updatedAt).toLocaleDateString('fr-FR', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</span>
							{/if}
						</div>
					</div>
					<span
						class="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium {getStatusBadgeClass(
							article.status
						)}"
					>
						{translateStatus(article.status)}
					</span>
				</div>
			</a>
		{/each}
	</div>
{/if}
