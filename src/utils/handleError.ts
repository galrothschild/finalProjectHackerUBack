import type { Response } from "express";
import type { ZodError } from "zod";
import "colors";
export const handleError = (
	res: Response,
	status: number,
	error: unknown,
	errorOccuredAt: string,
) => {
	const message =
		typeof error === "object" && error !== null && "message" in error
			? error.message
			: error;
	console.log(`Error ${errorOccuredAt}: ${message}`.red);
	return res.status(status).send(message);
};

export const handleZodError: (error: ZodError) => Promise<ZodError> = async (
	error,
) => {
	const errorMessage = error.errors.map((detail) => detail.message).join(", ");
	const errorObj = { ...error, message: errorMessage };
	console.error(errorObj.message.red);
	return Promise.reject({ ...errorObj, status: 400 });
};
