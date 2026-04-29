import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { sendEmail } from './mailer';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema
	}),
	trustedOrigins: ['https://mentis.lucesf.com', 'http://localhost:5173'],
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Réinitialisation de votre mot de passe Mentis',
				html: `
					<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
						<h2 style="color: #18181b; margin-bottom: 16px;">Réinitialisation de mot de passe</h2>
						<p style="color: #3f3f46;">Bonjour ${user.name},</p>
						<p style="color: #3f3f46;">Vous avez demandé à réinitialiser votre mot de passe Mentis. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.</p>
						<a href="${url}" style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #2563eb; color: white; border-radius: 6px; text-decoration: none; font-weight: 600;">
							Réinitialiser mon mot de passe
						</a>
						<p style="color: #71717a; font-size: 13px;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
					</div>
				`
			});
		}
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string
		}
	}
});
