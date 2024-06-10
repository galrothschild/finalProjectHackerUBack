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
