import z from "zod";

export const registerValidator = z.object({
    name : z.string().trim().min(3).max(50),
    email : z.email().trim(),
    password: z.string().min(6).max(20)
})

