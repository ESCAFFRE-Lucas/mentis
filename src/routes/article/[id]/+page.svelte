<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import * as Avatar from '$lib/components/ui/avatar';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const article = data.article;

	const user = $derived(page.data.user);

	const { form, enhance } = superForm(data.form, {
		applyAction: true,
		onResult: ({ result }) => {
			if (result.type === 'redirect') {
				toast.success("L'article a été supprimé avec succès !");

				goto(result.location);
			}
		}
	});
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<a href="/" class="mb-8 inline-block text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
		← Retour au fil d'actualité
	</a>

	{#if article}
		<article>
			{#if user && user.id === article.authorId}
				<div class="flex justify-end gap-3 mb-8 border-b border-zinc-100 pb-4">
					<a
						href="/article/{article.id}/edit"
						class="px-4 py-2 text-sm font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md transition-all"
					>
						Modifier
					</a>

					<form
						method="POST"
						action="?/deleteArticle"
						use:enhance
						>
						<button class="px-4 py-2 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-all border border-red-100">
							Supprimer
						</button>
					</form>
				</div>
			{/if}

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
	{/if}
</div>