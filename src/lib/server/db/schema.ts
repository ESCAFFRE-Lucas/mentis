import { pgTable, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const articleStatusEnum = pgEnum('article_status', [
	'DRAFT',
	'SUBMITTED',
	'UNDER_REVIEW',
	'ACCEPTED',
	'REJECTED',
	'ARCHIVED'
]);

export const reviewDecisionEnum = pgEnum('review_decision', ['ACCEPT', 'REVISIONS', 'REJECT']);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('emailVerified').notNull(),
	image: text('image'),
	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull(),

	role: text('role').default('USER').notNull(),
	reputationScore: integer('reputationScore').default(0).notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expiresAt').notNull(),
	token: text('token').notNull().unique(),

	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull(),

	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	userId: text('userId')
		.notNull()
		.references(() => user.id)
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => user.id),

	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	idToken: text('idToken'),

	accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
	refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),

	scope: text('scope'),
	password: text('password'),

	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),

	expiresAt: timestamp('expiresAt').notNull(),
	createdAt: timestamp('createdAt'),
	updatedAt: timestamp('updatedAt')
});

export const article = pgTable('article', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	title: text('title').notNull(),
	excerpt: text('excerpt').notNull(),
	content: text('content').notNull(),

	status: articleStatusEnum('status').default('DRAFT').notNull(),

	authorId: text('authorId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),

	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const review = pgTable('review', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	articleId: text('articleId')
		.notNull()
		.references(() => article.id, { onDelete: 'cascade' }),

	reviewerId: text('reviewerId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),

	decision: reviewDecisionEnum('decision').notNull(),
	comment: text('comment').notNull(),

	createdAt: timestamp('createdAt').defaultNow().notNull()
});
