<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { STATUS_LABELS, STATUS_COLORS } from '$lib/utils/status';

	let { data }: { data: PageData } = $props();
</script>

<div class="mb-8 flex items-center justify-between">
	<div>
		<h1 class="text-3xl font-bold">Mes articles</h1>
		<p class="mt-2 text-zinc-500">Gérez tous vos articles publiés et brouillons.</p>
	</div>
	<Button href="/article/new" class="bg-primary">Créer un article</Button>
</div>

{#if data.articles.length === 0}
	<div class="border rounded-xl bg-white p-12 text-center">
		<p class="mb-4 text-zinc-700">Vous n'avez pas encore écrit d'article.</p>
		<Button href="/article/new" class="bg-primary">Créer votre premier article</Button>
	</div>
{:else}
	<div class="space-y-4">
		{#each data.articles as a (a.id)}
			<a href="/article/{a.id}" class="block border rounded-xl bg-white p-6 hover:shadow-md transition-shadow">
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						<h2 class="mb-2 text-xl font-bold">{a.title}</h2>
						<p class="mb-3 text-sm text-zinc-600">{a.excerpt}</p>
						<div class="flex items-center gap-4 text-xs text-zinc-500">
							<span>Créé le {new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
							{#if a.updatedAt.getTime() !== a.createdAt.getTime()}
								<span>Mis à jour le {new Date(a.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
							{/if}
						</div>
					</div>
					<span class="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium {STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-700'}">
						{STATUS_LABELS[a.status] || a.status}
					</span>
				</div>
			</a>
		{/each}
	</div>
{/if}
