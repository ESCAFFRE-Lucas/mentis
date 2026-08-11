import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://c3a319d45aeac3210411759971cafba9@o4511892289028096.ingest.de.sentry.io/4511892292698192',

	tracesSampleRate: 1.0,

	// Enable logs to be sent to Sentry
	enableLogs: true

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});
