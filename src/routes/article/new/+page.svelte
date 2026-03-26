<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { articleSchema } from "./schema";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(articleSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="max-w-2xl mx-auto py-12 px-4">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-zinc-900">Rédiger un article</h1>
		<p class="text-zinc-500 mt-2">Partagez vos connaissances avec la communauté Mentis.</p>
	</div>

	<form method="POST" use:enhance class="space-y-6 bg-white p-6 rounded-xl border shadow-sm">

		<Form.Field {form} name="title">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Titre de l'article</Form.Label>
					<Input {...props} bind:value={$formData.title} placeholder="Ex: Pourquoi j'adore Svelte 5" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="excerpt">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Résumé (Visible sur l'accueil)</Form.Label>
					<Textarea {...props} bind:value={$formData.excerpt} placeholder="En quelques mots, de quoi parle cet article ?" class="resize-none h-20" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="content">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Contenu complet</Form.Label>
					<Textarea {...props} bind:value={$formData.content} placeholder="Votre texte ici..." class="min-h-[300px]" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="pt-4 flex justify-end gap-4">
			<Button variant="outline" href="/" type="button">Annuler</Button>
			<Button disabled={$delayed} type="submit">
				{#if $delayed}
					Publication en cours...
				{:else}
					Publier l'article
				{/if}
			</Button>
		</div>
	</form>
</div>