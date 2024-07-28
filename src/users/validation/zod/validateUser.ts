import { z } from "zod";

export const validateUserWithZod = (user) => {
	const signupSchema = z.object({
		username: z.string().min(6),
		email: z.string().email(),
		password: z
			.string()
			.regex(
				/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
				"At least One Capital, one lowercase and one number",
			),
		image: z
			.string()
			.url()
			.default("https://picsum.photos/300/200")
			.or(z.literal("")),
		name: z.object({
			first: z.string().min(2),
			middle: z.string().optional(),
			last: z.string().min(2),
		}),
	});

	return signupSchema.parse(user);
};
