<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const roleColors = { USER: 'bg-zinc-100 text-zinc-700', REVIEWER: 'bg-blue-100 text-blue-700', ADMIN: 'bg-purple-100 text-purple-700' };
	const statusColors = { DRAFT: 'bg-zinc-100 text-zinc-700', SUBMITTED: 'bg-blue-100 text-blue-700', UNDER_REVIEW: 'bg-yellow-100 text-yellow-700', ACCEPTED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' };
	const statusLabels = { DRAFT: 'Brouillons', SUBMITTED: 'Soumis', UNDER_REVIEW: 'En révision', ACCEPTED: 'Acceptés', REJECTED: 'Rejetés', ARCHIVED: 'Archivés' };
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Administration</h1>
	<p class="mt-2 text-zinc-500">Gérez les utilisateurs et surveillez les articles.</p>
</div>

<div class="mb-8 grid gap-4 md:grid-cols-6">
	{#each Object.entries(data.stats) as [status, count] (status)}
		<a href="/admin/articles?status={status}" class="block rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
			<div class="mb-2 text-2xl font-bold text-zinc-900">{count}</div>
			<div class="flex items-center gap-2">
				<span class="rounded-full px-2.5 py-1 text-xs font-medium {statusColors[status as keyof typeof statusColors]}">
					{statusLabels[status as keyof typeof statusLabels]}
				</span>
			</div>
		</a>
	{/each}
</div>

<div class="rounded-xl border bg-white shadow-sm">
	<div class="border-b p-6">
		<h2 class="text-xl font-bold text-zinc-900">Utilisateurs</h2>
		<p class="mt-1 text-sm text-zinc-500">Gérez les rôles des utilisateurs de la plateforme.</p>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="border-b bg-zinc-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-zinc-500">Nom</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-zinc-500">Email</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-zinc-500">Rôle</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-zinc-500">Réputation</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-zinc-500">Inscription</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-zinc-500">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y">
				{#each data.users as user (user.id)}
					<tr class="hover:bg-zinc-50">
						<td class="px-6 py-4 text-sm font-medium text-zinc-900">{user.name}</td>
						<td class="px-6 py-4 text-sm text-zinc-700">{user.email}</td>
						<td class="px-6 py-4">
							<span class="inline-block rounded-full px-2.5 py-1 text-xs font-medium {roleColors[user.role as keyof typeof roleColors]}">
								{user.role}
							</span>
						</td>
						<td class="px-6 py-4 text-sm text-zinc-700">{user.reputationScore}</td>
						<td class="px-6 py-4 text-sm text-zinc-700">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
						<td class="px-6 py-4">
							<form method="POST" action="?/updateRole" use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') await invalidateAll();
								};
							}} class="flex gap-2">
								<input type="hidden" name="userId" value={user.id} />
								<select name="role" class="rounded border px-2 py-1 text-xs" value={user.role}>
									<option value="USER">USER</option>
									<option value="REVIEWER">REVIEWER</option>
									<option value="ADMIN">ADMIN</option>
								</select>
								<Button type="submit" size="sm" variant="outline" class="h-7 text-xs">Modifier</Button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
