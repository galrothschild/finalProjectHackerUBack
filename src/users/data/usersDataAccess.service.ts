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
		return await UserModel.findByIdAndDelete(userId);
	} catch (error) {
		return Promise.reject(error);
	}
};
