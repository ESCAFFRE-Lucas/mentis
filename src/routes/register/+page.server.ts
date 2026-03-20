import {message, superValidate} from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { registerSchema } from "./schema";
import {type Actions, fail} from "@sveltejs/kit";

export const load = async () => {
    return {
        form: await superValidate(zod4(registerSchema))
    };
};