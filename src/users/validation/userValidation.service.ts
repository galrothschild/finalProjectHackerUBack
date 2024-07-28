import { validateUserWithZod } from "./zod/validateUser";

const validator = process.env.VALIDATOR || "Zod";

export default function validateCard(user: unknown) {
	if (validator === "Zod") {
		return validateUserWithZod(user);
	}
}
