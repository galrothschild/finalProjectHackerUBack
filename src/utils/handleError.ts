import type { Response } from "express";
import type { ZodError } from "zod";
import "colors";
import logger from "./logger/logger.js";
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
	logger.error(`${errorOccuredAt}: ${message}`.red);
	return res.status(status).send({ error: message });
};

export const handleZodError = (res, error: ZodError) => {
	const message = error.errors
		.map((err) => `${err.path[0]}: ${err.message}`)
		.join("\n");
	logger.error(`Validating User: ${message}`.red);
	return res.status(400).send(message);
};
