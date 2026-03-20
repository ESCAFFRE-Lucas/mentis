<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { registerSchema } from './schema';
	import { signUp } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import type { PageServerLoad } from './$types';

	type PageProps = {
		data: PageServerLoad;
	};

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		SPA: true,
		validators: zod4Client(registerSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				const { error } = await signUp.email({
					name: form.data.name,
					email: form.data.email,
					password: form.data.password
				});

				if (error) {
					form.message = "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.";
				} else {
					await goto('/');
				}
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50">
	<div class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
		<h2 class="mb-6 text-center text-2xl font-bold text-zinc-900">Rejoindre Mentis</h2>

		{#if $message}
			<div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{$message}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nom d'utilisateur</Form.Label>
						<Input {...props} bind:value={$formData.name} placeholder="John Doe" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email professionnel</Form.Label>
						<Input {...props} bind:value={$formData.email} placeholder="john@entreprise.com" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Mot de passe</Form.Label>
						<Input type="password" {...props} bind:value={$formData.password} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button disabled={$delayed} class="mt-6 w-full">
				{#if $delayed}
					Création en cours...
				{:else}
					S'inscrire
				{/if}
			</Form.Button>
		</form>
	</div>
</div>
