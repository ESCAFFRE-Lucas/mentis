<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const roleLabels = { USER: 'Utilisateur', REVIEWER: 'Reviewer', ADMIN: 'Administrateur' };
	const roleColors = {
		USER: 'bg-zinc-100 text-zinc-700',
		REVIEWER: 'bg-blue-100 text-blue-700',
		ADMIN: 'bg-purple-100 text-purple-700'
	};
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Profil de {data.profileUser.name}</h1>
	<p class="mt-2 text-zinc-500">Découvrez les articles publiés par cet auteur.</p>
</div>

<div class="space-y-6">
	<div class="rounded-xl border bg-white p-6 shadow-sm">
		<div class="flex items-center gap-4">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl font-bold text-white"
			>
				{data.profileUser.name ? data.profileUser.name[0].toUpperCase() : '?'}
			</div>
			<div class="flex-1">
				<p class="text-lg font-semibold text-zinc-900">{data.profileUser.name}</p>
				<span
					class="mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium {roleColors[
						data.profileUser.role as keyof typeof roleColors
					]}"
				>
					{roleLabels[data.profileUser.role as keyof typeof roleLabels]}
				</span>
			</div>
			<div class="text-right">
				<p class="text-2xl font-bold text-zinc-900">{data.profileUser.reputationScore}</p>
				<p class="text-sm text-zinc-500">Réputation</p>
			</div>
			<div class="text-right">
				<p class="text-2xl font-bold text-zinc-900">{data.articleCount}</p>
				<p class="text-sm text-zinc-500">Articles publiés</p>
			</div>
		</div>
	</div>

	{#if data.articles.length === 0}
		<div class="rounded-xl border bg-white p-12 text-center shadow-sm">
			<p class="text-zinc-700">Cet auteur n'a pas encore publié d'article.</p>
		</div>
	{:else}
		<div class="rounded-xl border bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-bold text-zinc-900">Articles publiés</h2>
			<div class="space-y-4">
				{#each data.articles as article (article.id)}
					<a
						href="/article/{article.id}"
						class="block rounded-lg border p-4 transition-all hover:shadow-md"
					>
						<h3 class="mb-2 text-lg font-bold text-zinc-900">{article.title}</h3>
						<p class="mb-3 text-sm text-zinc-600">{article.excerpt}</p>
						<p class="text-xs text-zinc-500">
							Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})}
						</p>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>
