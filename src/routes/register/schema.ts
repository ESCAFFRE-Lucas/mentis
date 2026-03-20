import { z } from "zod";

export const formSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
    email: z.email("Veuillez entrer une adresse email valide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(50)
});

export type FormSchema = typeof formSchema;