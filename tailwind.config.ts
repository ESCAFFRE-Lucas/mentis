import type { Config } from 'tailwindcss';

const config: Config = {
	theme: {
		extend: {
			colors: {
				mentis: {
					graphite: '#121212',
					anthracite: '#2D3748',
					indigo: '#6366F1',
					ambre: '#D97706',
					brume: '#F3F4F6'
				}
			}
		}
	}
};

export default config;
