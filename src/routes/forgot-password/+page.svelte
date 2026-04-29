<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { forgotPasswordSchema } from './schema';
	import { authClient } from '$lib/auth-client';
	import type { PageServerLoad } from './$types';

	type PageProps = {
		data: PageServerLoad;
	};

	let { data }: PageProps = $props();

	let emailSent = $state(false);

	const form = superForm(data.form, {
		SPA: true,
		validators: zod4Client(forgotPasswordSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				await authClient.forgetPassword({
					email: form.data.email,
					redirectTo: '/reset-password'
				});
				emailSent = true;
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50">
	<div class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
		{#if emailSent}
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
				>
					<svg
						class="h-6 w-6 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						></path>
					</svg>
				</div>
				<h2 class="mb-2 text-2xl font-bold text-zinc-900">Email envoyé !</h2>
				<p class="text-zinc-500">
					Si un compte existe avec cette adresse, vous recevrez un email avec un lien pour
					réinitialiser votre mot de passe.
				</p>
				<a href="/login" class="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline">
					Retour à la connexion
				</a>
			</div>
		{:else}
			<h2 class="mb-2 text-center text-2xl font-bold text-zinc-900">Mot de passe oublié</h2>
			<p class="mb-6 text-center text-sm text-zinc-500">
				Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de
				passe.
			</p>

			<form method="POST" use:enhance class="space-y-4">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} placeholder="john@entreprise.com" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button disabled={$delayed} class="mt-6 w-full">
					{#if $delayed}
						Envoi en cours...
					{:else}
						Envoyer le lien
					{/if}
				</Form.Button>
			</form>

			<div class="mt-4 text-center text-sm text-zinc-600">
				<a href="/login" class="font-medium text-blue-600 hover:underline">
					Retour à la connexion
				</a>
			</div>
		{/if}
	</div>
</div>