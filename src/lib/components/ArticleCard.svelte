<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	export type Article = {
		id: string;
		title: string;
		excerpt: string;
		author: {
			id: string;
			name: string;
		};
		createdAt: Date;
	};

	let { article }: { article: Article } = $props();

	let formattedDate = $derived(
		new Intl.DateTimeFormat('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(article.createdAt)
	);
</script>

<Card.Root class="transition-shadow duration-200 hover:shadow-md">
	<Card.Header>
		<div class="mb-2 flex items-center justify-between gap-3">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
					{article.author.name.charAt(0).toUpperCase()}
				</div>
				<div class="flex flex-col">
					<a href="/profil/{article.author.id}" class="text-sm font-medium text-zinc-900 hover:text-blue-600 hover:underline">{article.author.name}</a>
					<span class="text-xs text-zinc-500">{formattedDate}</span>
				</div>
			</div>
			<span class="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
				✓ Validé par un expert
			</span>
		</div>
		<Card.Title class="text-xl">
			<a href="/article/{article.id}" class="hover:text-blue-600 hover:underline">
				{article.title}
			</a>
		</Card.Title>
	</Card.Header>

	<Card.Content>
		<p class="line-clamp-3 text-sm text-zinc-600">
			{article.excerpt}
		</p>
	</Card.Content>

</Card.Root>
