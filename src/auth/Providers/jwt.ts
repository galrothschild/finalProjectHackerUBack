import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import type { IUserDocument } from "../../users/data/User.model.js";

const tokenKey = process.env.TOKEN_SECRET || "secret";
const refreshTokenKey = process.env.REFRESH_TOKEN || "refresh";
export const generateToken = (
	user:
		| IUserDocument
		| { _id: Types.ObjectId; isAdmin: boolean; isBusiness: boolean },
) => {
	const { _id, isAdmin } = user;
	const token = jwt.sign({ _id, isAdmin }, tokenKey, {
		expiresIn: "1h",
	});
	return token;
};

export const generateRefreshToken = (
	user:
		| IUserDocument
		| { _id: Types.ObjectId; isAdmin: boolean; isBusiness: boolean },
) => {
	const { _id, isAdmin } = user;
	const token = jwt.sign({ _id, isAdmin }, refreshTokenKey, {
		expiresIn: "7d",
	});
	return token;
};

export const verifyRefreshToken = (token: string) => {
	const decoded = jwt.verify(token, refreshTokenKey);
	return decoded;
};
export const verifyToken = (token: string) => {
	const decoded = jwt.verify(token, tokenKey);
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
