import jwt from "jsonwebtoken";
import type { IUser } from "../../users/models/IUser.model";
import type { Types } from "mongoose";

const key = process.env.TOKEN_SECRET || "secret";
export const generateToken = (
	user: IUser | { _id: Types.ObjectId; isAdmin: boolean; isBusiness: boolean },
) => {
	const { _id, isAdmin, isBusiness } = user;
	const token = jwt.sign({ _id, isAdmin, isBusiness }, key, {
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
