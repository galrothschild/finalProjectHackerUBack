import { validateUserWithZod } from "./zod/validateUser.js";

const validator = process.env.VALIDATOR || "Zod";

export default function validateUser(user: unknown) {
	if (validator === "Zod") {
		return validateUserWithZod(user);
	}
	return null;
}
