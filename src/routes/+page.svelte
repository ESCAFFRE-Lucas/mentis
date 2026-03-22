<script lang="ts">
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<h1>Fil d'actualité Mentis</h1>

{#if data.user}
	<div class="card p-4 border rounded-md my-4">
		<p>Bonjour {data.user.name}, quoi de neuf ?</p>
		<button class="bg-blue-600 text-white px-4 py-2 rounded mt-2">Créer un article</button>
	</div>
{:else}
	<div class="banner p-4 bg-zinc-100 rounded-md my-4 text-center">
		<p class="mb-2">Rejoignez la communauté Mentis pour publier des articles !</p>
		<a href="/register" class="text-blue-600 underline">S'inscrire</a>
	</div>
{/if}

<div class="articles-feed"></div>