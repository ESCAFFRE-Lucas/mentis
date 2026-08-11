import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		await db.execute(sql`SELECT 1`);

		return json(
			{
				status: 'ok',
				timestamp: new Date().toISOString(),
				database: 'connected'
			},
			{ status: 200 }
		);
	} catch {
		return json(
			{
				status: 'error',
				timestamp: new Date().toISOString(),
				database: 'disconnected'
			},
			{ status: 503 }
		);
	}
};