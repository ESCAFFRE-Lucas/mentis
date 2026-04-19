import { z } from 'zod';

export const deleteArticleSchema = z.object({
	id: z.string().min(1, "L'identifiant est requis")
});

export type DeleteArticleSchema = z.infer<typeof deleteArticleSchema>;