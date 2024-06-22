import type { NextFunction, Request, Response } from "express";
import { handleError } from "../utils/handleError.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "./Providers/jwt.js";
const key = process.env.TOKEN_SECRET || "secret";
const tokenGenerator = process.env.TOKEN_GENERATOR || "jwt";

export interface AuthenticatedRequest extends Request {
	user?: JwtPayload;
}

export const auth = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	if (tokenGenerator === "jwt") {
		const token = req.header("x-auth-token");
		if (!token) {
			return handleError(res, 401, "Access Denied", "Authenticating User");
		}
		try {
			const decoded = jwt.verify(token, key) as JwtPayload;
			if (decoded.exp * 1000 < Date.now()) {
				return handleError(res, 401, "Token expired", "Authenticating User");
			}
			req.user = decoded;
			return next();
		} catch (error: unknown) {
			return res.status(400).json("Invalid Token");
		}
	}
};
