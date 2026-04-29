import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

export const sendEmail = async ({
	to,
	subject,
	html
}: {
	to: string;
	subject: string;
	html: string;
}) => {
	const transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: Number(env.SMTP_PORT) || 587,
		secure: env.SMTP_SECURE === 'true',
		auth: {
			user: env.SMTP_USER,
			pass: env.SMTP_PASS
		}
	});

	await transporter.sendMail({
		from: `"Mentis" <${env.SMTP_FROM}>`,
		to,
		subject,
		html
	});
};