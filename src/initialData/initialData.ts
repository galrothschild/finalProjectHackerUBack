import { UserModel } from "../users/data/User.model.js";
import { createUser } from "../users/data/usersDataAccess.service.js";
import logger from "../utils/logger/logger.js";

export const initialUsers = [
	{
		username: "admin",
		password: "Aa123456",
		email: "admin@email.com",
		image:
			"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
		name: {
			first: "Admin",
			last: "Admin",
		},
		isAdmin: true,
		watchList: [],
	},
	{
		username: "user",
		password: "Aa123456",
		email: "user@email.com",
		image:
			"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
		name: {
			first: "User",
			last: "User",
		},
		isAdmin: false,
		watchList: [],
	},
];

const loadInitialUsers = async () => {
	const userCount = await UserModel.countDocuments();
	if (userCount === 0) {
		for (const user of initialUsers) {
			await createUser(user);
		}
		logger.info("Initial users loaded");
	}
};

// In case we ever add more initial data, we can add it here
export const loadInitialData = async () => {
	await loadInitialUsers();
};
