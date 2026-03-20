import {message, superValidate} from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { registerSchema } from "./schema";
import {type Actions, fail} from "@sveltejs/kit";

export const load = async () => {
    return {
        form: await superValidate(zod4(registerSchema))
    };
};

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod4(registerSchema));
        console.log(form);

        if (!form.valid) {
            return fail(400, { form });
        }
        return message(form, 'Form posted successfully!');
    }
};