import { UserModel, type IUser } from "./User.model.js";

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
		console.log("Deleting user: ".bgGreen, userId);
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
