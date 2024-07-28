import { z } from "zod";

export const validateUserWithZod = (user) => {
	const schema = z.object({
		email: z.string().email(),
		username: z.string().min(6),
		password: z.string(),
	});
	return schema.parse(user);
};
