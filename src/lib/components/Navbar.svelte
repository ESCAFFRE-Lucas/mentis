<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { signOut } from "$lib/auth-client";
	import { goto } from "$app/navigation";

	import type { User } from "better-auth";

	let { user }: { user: User | null | undefined } = $props();

	const handleLogout = async () => {
		await signOut();
		await goto('/login');
	};
</script>

<header class="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
	<div class="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">

		<a href="/" class="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900">
			Mentis
		</a>

		<div class="flex items-center gap-4">
			{#if user}
				<Button href="/article/new" variant="outline" class="hidden sm:flex">
					Créer un article
				</Button>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<div class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 hover:bg-blue-200 transition-colors">
							{user.name ? user.name.charAt(0).toUpperCase() : 'U'}
						</div>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content align="end" class="w-64">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none truncate">
									{user.name}
								</p>
								<p class="text-xs leading-none text-zinc-500 truncate">
									{user.email}
								</p>
							</div>
						</DropdownMenu.Label>

						<DropdownMenu.Separator />

						<DropdownMenu.Item class="cursor-pointer">
							{#snippet child({ props })}
								<a href="/profil" {...props}>
									Mon Profil
								</a>
							{/snippet}
						</DropdownMenu.Item>

						<DropdownMenu.Separator />

						<DropdownMenu.Item
							onclick={handleLogout}
							class="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
						>
							Se déconnecter
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

			{:else}
				<Button href="/login" variant="ghost">Se connecter</Button>
				<Button href="/register">S'inscrire</Button>
			{/if}
		</div>
	</div>
</header>