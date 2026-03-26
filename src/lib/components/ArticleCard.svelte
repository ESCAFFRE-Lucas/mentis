<script lang="ts">
	import * as Card from "$lib/components/ui/card";

	export type Article = {
		id: string;
		title: string;
		excerpt: string;
		author: {
			name: string;
		};
		createdAt: Date;
		likesCount: number;
		commentsCount: number;
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

<Card.Root class="hover:shadow-md transition-shadow duration-200">
	<Card.Header>
		<div class="flex items-center gap-3 mb-2">
			<div class="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
				{article.author.name.charAt(0).toUpperCase()}
			</div>
			<div class="flex flex-col">
				<span class="text-sm font-medium text-zinc-900">{article.author.name}</span>
				<span class="text-xs text-zinc-500">{formattedDate}</span>
			</div>
		</div>
		<Card.Title class="text-xl">
			<a href="/article/{article.id}" class="hover:text-blue-600 hover:underline">
				{article.title}
			</a>
		</Card.Title>
	</Card.Header>

	<Card.Content>
		<p class="text-zinc-600 text-sm line-clamp-3">
			{article.excerpt}
		</p>
	</Card.Content>

	<Card.Footer class="flex gap-4 border-t pt-4 text-zinc-500">
		<button class="flex items-center gap-1.5 text-sm hover:text-red-500 transition-colors">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
			<span>{article.likesCount}</span>
		</button>
		<button class="flex items-center gap-1.5 text-sm hover:text-blue-500 transition-colors">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
			<span>{article.commentsCount}</span>
		</button>
	</Card.Footer>
</Card.Root>