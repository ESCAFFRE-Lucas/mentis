<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { formSchema } from "./schema";
    import { signUp } from "$lib/auth-client";
    import { goto } from "$app/navigation";

    let { data } = $props();

    const form = superForm(data.form, {
        SPA: true,
        validators: zodClient(formSchema),
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

<div class="min-h-screen flex items-center justify-center bg-zinc-50">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-sm border border-zinc-200">
        <h2 class="text-2xl font-bold text-center text-zinc-900 mb-6">Rejoindre Mentis</h2>

        {#if $message}
            <div class="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                {$message}
            </div>
        {/if}

        <form method="POST" class="space-y-4">
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

            <Form.Button disabled={$delayed} class="w-full mt-6">
                {#if $delayed}
                    Création en cours...
                {:else}
                    S'inscrire
                {/if}
            </Form.Button>
        </form>
    </div>
</div>