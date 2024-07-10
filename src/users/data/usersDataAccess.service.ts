import {
	generateRefreshToken,
	generateToken,
} from "../../auth/Providers/jwt.js";
import { type IUserDocument, UserModel, type IUser } from "./User.model.js";
import bcrypt from "bcrypt";

// create user in the database
export const createUser = async (user: IUser) => {
	try {
		const newUser = new UserModel(user);
		return await newUser.save();
	} catch (error) {
		return Promise.reject(error);
	}
};

// delete user from the database
export const deleteUser = async (userId: string) => {
	try {
		const user = await UserModel.findByIdAndDelete(userId);
		return user;
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getAllUsers = async () => {
	try {
		return await UserModel.find();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getUser = async (userId: string) => {
	try {
		return await UserModel.findById(userId);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const updateUser = async (userId: string, user: IUser) => {
	try {
		return await UserModel.findByIdAndUpdate(userId, user, { new: true });
	} catch (error) {
		return Promise.reject(error);
	}
};

const pepper = process.env.PEPPER || "pepper";

export const loginUser: (
	user: {
		username: string;
		password: string;
	},
	key: "username" | "email",
) => Promise<Record<string, string>> = async (user, key) => {
	const { username, password } = user;
	try {
		const userFromDB = (await UserModel.findOne({
			[key]: username,
		}).select("+password")) as IUserDocument;
		const id = userFromDB._id;
		const isValidPassword = await bcrypt.compare(
			pepper + password,
			userFromDB.password,
		);
		if (isValidPassword) {
			const token = generateToken(userFromDB);
			const refreshToken = generateRefreshToken(userFromDB);
			await UserModel.findByIdAndUpdate(id, {
				failCount: 0,
				lockedUntil: undefined,
			});
			return Promise.resolve({ token, refreshToken });
		}
		if (userFromDB.isAdmin) {
			return Promise.reject("Invalid Email or Password");
		}
		return Promise.reject("Invalid Email or Password");
	} catch (error: unknown) {
		return Promise.reject(error);
	}
};

export const doesUserExist = async (value: string, key: string) => {
	try {
		const user = await UserModel.findOne({ [key]: value });
		return user;
	} catch (error) {
		return Promise.reject(error);
	}
};
