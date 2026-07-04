<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const roleLabels = { USER: 'Utilisateur', REVIEWER: 'Reviewer', ADMIN: 'Administrateur' };
	const roleColors = { USER: 'bg-zinc-100 text-zinc-700', REVIEWER: 'bg-blue-100 text-blue-700', ADMIN: 'bg-purple-100 text-purple-700' };
	const statusLabels = { DRAFT: 'Brouillons', SUBMITTED: 'Soumis', UNDER_REVIEW: 'En révision', ACCEPTED: 'Acceptés', REJECTED: 'Rejetés', ARCHIVED: 'Archivés' };
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Mon Profil</h1>
	<p class="mt-2 text-zinc-500">Gérez vos informations personnelles et consultez vos statistiques.</p>
</div>

<div class="space-y-6">
	<div class="rounded-xl border bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-xl font-bold text-zinc-900">Informations personnelles</h2>
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl font-bold text-white">
					{data.user.name ? data.user.name[0].toUpperCase() : '?'}
				</div>
				<div>
					<p class="text-lg font-semibold text-zinc-900">{data.user.name}</p>
					<p class="text-sm text-zinc-500">{data.user.email}</p>
				</div>
			</div>
				<div class="grid gap-4 pt-4 md:grid-cols-2">
					<div>
						<p class="text-sm text-zinc-500">Rôle</p>
						<span class="mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium {roleColors[data.user.role as keyof typeof roleColors]}">
							{roleLabels[data.user.role as keyof typeof roleLabels]}
						</span>
					</div>
					<div>
						<p class="text-sm text-zinc-500">Réputation</p>
						<p class="mt-1 text-lg font-bold text-zinc-900">{data.user.reputationScore} points</p>
					</div>
					<div>
						<p class="text-sm text-zinc-500">Membre depuis</p>
						<p class="mt-1 text-zinc-900">{new Date(data.user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
					</div>
			</div>
		</div>
	</div>

	<div class="rounded-xl border bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-xl font-bold text-zinc-900">Mes statistiques</h2>
		<div class="grid gap-4 md:grid-cols-3">
			{#each Object.entries(data.stats) as [status, count] (status)}
				<div class="rounded-lg border p-4">
					<p class="text-2xl font-bold text-zinc-900">{count}</p>
					<p class="mt-1 text-sm text-zinc-500">{statusLabels[status as keyof typeof statusLabels]}</p>
				</div>
			{/each}
		</div>
		<div class="mt-4 flex justify-end">
			<a href="/mes-articles" class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
				Voir mes articles →
			</a>
		</div>
	</div>
</div>
