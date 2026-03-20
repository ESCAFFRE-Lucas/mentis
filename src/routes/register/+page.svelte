<script lang="ts">
    import { signUp } from '$lib/auth-client';
    import { goto } from '$app/navigation';

    let name = $state('');
    let email = $state('');
    let password = $state('');
    let errorMessage = $state('');
    let isLoading = $state(false);

    async function handleRegister(e: Event) {
        e.preventDefault();
        isLoading = true;
        errorMessage = '';

        const { data, error } = await signUp.email({
            email,
            password,
            name
        });

        if (error) {
            if (error.message?.includes('[body.email]')) {
                errorMessage = "Le format de l'adresse email est invalide.";
            } else if (error.message?.includes('Password is too short')) {
                errorMessage = "Le mot de passe doit contenir au moins 8 caractères.";
            } else if (error.message?.includes('already exists') || error.status === 409) {
                errorMessage = "Cet email est déjà utilisé par un autre compte.";
            } else {
                errorMessage = error.message?.replace(/\[.*?\]\s*/g, '') || "Une erreur est survenue lors de l'inscription.";
            }

            isLoading = false;
            return;
        }

        await goto('/');
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Rejoindre Mentis</h2>

        {#if errorMessage}
            <div class="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                {errorMessage}
            </div>
        {/if}

        <form onsubmit={handleRegister} class="space-y-6">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                <input
                        type="text"
                        id="name"
                        bind:value={name}
                        required
                        class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                        type="email"
                        id="email"
                        bind:value={email}
                        required
                        class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                        type="password"
                        id="password"
                        bind:value={password}
                        required
                        class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>

            <button
                    type="submit"
                    disabled={isLoading}
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {#if isLoading}
                    Création du compte...
                {:else}
                    S'inscrire
                {/if}
            </button>
        </form>
    </div>
</div>