import z from "zod";

export const SignupSchema = z.object({
    username: z.string().min(5).max(30),
    password: z.string().min(6).max(30),
    name: z.string().min(2).max(30),
})
export const SigninSchema = z.object({
    username: z.string(),
    password: z.string()
})

