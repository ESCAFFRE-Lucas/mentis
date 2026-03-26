import { z } from 'zod';

export const articleSchema = z.object({
	title: z.string().min(5, "Le titre doit faire au moins 5 caractères").max(100, "Le titre est trop long"),
	excerpt: z.string().min(10, "Le résumé doit faire au moins 10 caractères").max(255, "Le résumé est trop long"),
	content: z.string().min(20, "L'article est trop court, développez un peu plus !")
});

export type ArticleSchema = z.infer<typeof articleSchema>;