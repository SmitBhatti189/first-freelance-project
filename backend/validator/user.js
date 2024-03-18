import z from 'zod';

const userSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(5).max(20),
});

export { userSchema }