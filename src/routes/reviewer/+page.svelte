<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
	let selectedArticleId = $state<string | null>(null);
	let selectedDecision = $state<'ACCEPT' | 'REJECT' | null>(null);
	let comment = $state('');

	const openForm = (id: string) => { selectedArticleId = id; selectedDecision = null; comment = ''; };
	const closeForm = () => { selectedArticleId = null; selectedDecision = null; comment = ''; };
	const btnClass = (decision: string) => selectedDecision === decision ?
		`border-${decision === 'ACCEPT' ? 'green' : 'red'}-500 bg-${decision === 'ACCEPT' ? 'green' : 'red'}-50 text-${decision === 'ACCEPT' ? 'green' : 'red'}-700` :
		'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50';
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold">Interface Reviewer</h1>
	<p class="mt-2 text-zinc-500">Articles en attente de review.</p>
</div>

{#if data.articles.length === 0}
	<div class="border rounded-xl bg-white p-12 text-center">
		<p class="text-zinc-700">Aucun article en attente de review.</p>
	</div>
{:else}
	<div class="space-y-4">
		{#each data.articles as a (a.id)}
			<div class="border rounded-xl bg-white p-6">
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						<h2 class="mb-2 text-xl font-bold">{a.title}</h2>
						<p class="mb-3 text-sm text-zinc-600">{a.excerpt}</p>
						<div class="flex items-center gap-4 text-xs text-zinc-500">
							<span>Par {a.authorName}</span>
							<span>Soumis le {new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
						</div>
					</div>
					<div class="flex gap-2">
						<Button href="/article/{a.id}" variant="outline" size="sm">Voir</Button>
						<Button onclick={() => openForm(a.id)} size="sm" class="bg-primary">Review</Button>
					</div>
				</div>
				{#if selectedArticleId === a.id}
					<div class="mt-6 border-t pt-6">
						<form method="POST" action="?/review" use:enhance>
							<input type="hidden" name="articleId" value={a.id} />
							<div class="mb-4">
								<label class="mb-2 block text-sm font-medium">Décision</label>
								<div class="flex gap-3">
									<button type="button" onclick={() => (selectedDecision = 'ACCEPT')} class="flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors {btnClass('ACCEPT')}">
										✓ Accepter
									</button>
									<button type="button" onclick={() => (selectedDecision = 'REJECT')} class="flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors {btnClass('REJECT')}">
										✗ Rejeter
									</button>
								</div>
								<input type="hidden" name="decision" value={selectedDecision || ''} />
							</div>
							<div class="mb-4">
								<label for="comment" class="mb-2 block text-sm font-medium">Commentaire</label>
								<textarea id="comment" name="comment" bind:value={comment} rows="4" class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Justifiez votre décision..."></textarea>
							</div>
							<div class="flex justify-end gap-3">
								<Button type="button" variant="outline" onclick={closeForm}>Annuler</Button>
								<Button type="submit" disabled={!selectedDecision || !comment.trim()} class="bg-primary">Envoyer la review</Button>
							</div>
						</form>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
