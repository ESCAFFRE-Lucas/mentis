<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { loginSchema } from "./schema";
	import { signIn } from "$lib/auth-client";
	import { goto } from "$app/navigation";
	import type { PageServerLoad } from "./$types";

	type PageProps = {
		data: PageServerLoad
	}

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		SPA: true,
		validators: zod4Client(loginSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				const { error } = await signIn.email({
					email: form.data.email,
					password: form.data.password
				});

				if (error) {
					form.message = "Email ou mot de passe incorrect.";
				} else {
					await goto('/');
				}
			}
		}
	});

	const loginWithGithub = async () => {
		await signIn.social({
			provider: "github",
			callbackURL: "/"
		});
	};

	const { form: formData, enhance, message, delayed } = form;
</script>

<div class="min-h-screen flex items-center justify-center bg-zinc-50">
	<div class="max-w-md w-full p-8 bg-white rounded-xl shadow-sm border border-zinc-200">
		<h2 class="text-2xl font-bold text-center text-zinc-900 mb-6">Connexion</h2>

		{#if $message}
			<div class="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
				{$message}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
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

			<Form.Button disabled={$delayed} class="w-full mt-6">
				{#if $delayed}
					Connexion en cours...
				{:else}
					Se connecter
				{/if}
			</Form.Button>
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t border-zinc-300"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-white px-2 text-zinc-500">Ou</span>
				</div>
			</div>

			<button
				type="button"
				onclick={loginWithGithub}
				class="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus:outline-none"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
				Se connecter avec GitHub
			</button>
		</form>
		<div class="mt-4 text-center text-sm text-zinc-600">
			Pas encore de compte ?
			<a href="/register" class="font-medium text-blue-600 hover:underline">
				S'inscrire
			</a>
		</div>
	</div>
</div>