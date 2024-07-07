import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import type { IUserDocument } from "../../users/data/User.model.js";

const key = process.env.TOKEN_SECRET || "secret";
export const generateToken = (
	user:
		| IUserDocument
		| { _id: Types.ObjectId; isAdmin: boolean; isBusiness: boolean },
) => {
	const { _id, isAdmin } = user;
	const token = jwt.sign({ _id, isAdmin }, key, {
		expiresIn: "1h",
	});
	return token;
};

export const verifyToken = (token: string) => {
	const decoded = jwt.verify(token, key);
	return decoded;
};

export const decodedToken = (token: string) => jwt.decode(token);
export type JwtPayload = {
	_id: string;
	isAdmin: boolean;
	isBusiness: boolean;
	exp: number;
	iat: number;
};
