<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { resetPasswordSchema } from './schema';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageServerLoad } from './$types';

	type PageProps = {
		data: PageServerLoad;
	};

	let { data }: PageProps = $props();

	const token = $derived(page.url.searchParams.get('token') ?? '');

	const form = superForm(data.form, {
		SPA: true,
		validators: zod4Client(resetPasswordSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				const { error } = await authClient.resetPassword({
					newPassword: form.data.password,
					token
				});

				if (error) {
					form.message = 'Ce lien est invalide ou a expiré. Veuillez faire une nouvelle demande.';
				} else {
					await goto('/login');
				}
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50">
	<div class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
		<h2 class="mb-2 text-center text-2xl font-bold text-zinc-900">Nouveau mot de passe</h2>
		<p class="mb-6 text-center text-sm text-zinc-500">Choisissez un nouveau mot de passe sécurisé.</p>

		{#if $message}
			<div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{$message}
			</div>
		{/if}

		{#if !token}
			<div class="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
				Lien invalide. Veuillez refaire une demande de réinitialisation.
			</div>
			<div class="mt-4 text-center">
				<a href="/forgot-password" class="text-sm font-medium text-blue-600 hover:underline">
					Réinitialiser mon mot de passe
				</a>
			</div>
		{:else}
			<form method="POST" use:enhance class="space-y-4">
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nouveau mot de passe</Form.Label>
							<Input type="password" {...props} bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="confirmPassword">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Confirmer le mot de passe</Form.Label>
							<Input type="password" {...props} bind:value={$formData.confirmPassword} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button disabled={$delayed} class="mt-6 w-full">
					{#if $delayed}
						Mise à jour en cours...
					{:else}
						Mettre à jour le mot de passe
					{/if}
				</Form.Button>
			</form>
		{/if}
	</div>
</div>