import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { registerSchema } from './schema';

export const load = async () => {
	return {
		form: await superValidate(zod4(registerSchema))
	};
};
