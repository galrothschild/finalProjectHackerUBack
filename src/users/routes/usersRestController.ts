import { Router, type Request, type Response } from "express";
import {
	createUser,
	deleteUser,
	doesUserExist,
	getAllUsers,
	getUser,
	loginUser,
	updateUser,
} from "../data/usersDataAccess.service.js";
import { handleError, handleZodError } from "../../utils/handleError.js";
import { normalizeUser } from "../utils/normalizeUser.js";
import type { loginUserType } from "../data/User.model.js";
import { generateToken, verifyRefreshToken } from "../../auth/Providers/jwt.js";
import { auth, type AuthenticatedRequest } from "../../auth/auth.service.js";
import { getTVShow } from "../../tv/data/TVDataAccess.service.js";
import { getMovie } from "../../movies/data/movieDataAccess.service.js";
import logger from "../../utils/logger/logger.js";
import validateUser from "../validation/userValidation.service.js";

const router = Router();

router.post("/", async (req, res) => {
	try {
		const user = req.body;
		const userExistsEmail = await doesUserExist(user.email, "email");
		const userExistsUsername = await doesUserExist(user.username, "username");
		if (userExistsEmail || userExistsUsername) {
			return res
				.status(400)
				.send("User already exists with this email or username");
		}
		try {
			validateUser(user);
		} catch (error) {
			return handleZodError(res, error);
		}
		const normalizedUser = normalizeUser(user);
		const createdUser = await createUser(normalizedUser);
		return res.status(201).send(createdUser);
	} catch (error) {
		logger.error(error);
		return handleError(res, 500, error, "Error creating user");
	}
});

router.post("/login", async (req: Request, res: Response) => {
	try {
		const user: loginUserType = req.body;
		user.username = user.username.toLowerCase();
		const userExistsEmail = await doesUserExist(user.username, "email");
		const userExistsUsername = await doesUserExist(user.username, "username");
		if (!userExistsUsername && !userExistsEmail) {
			return handleError(
				res,
				400,
				"Invalid Username or Password",
				"logging in user",
			);
		}
		const key = userExistsEmail ? "email" : "username";

		const { token, refreshToken } = await loginUser(user, key);
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});
		return res.status(200).send(token);
	} catch (error: unknown) {
		if (error === "Invalid Username or Password") {
			return res.status(400).send(error);
		}
		if (
			error ===
			"User locked after 3 attempts, please try again after 15 minutes"
		) {
			return res.status(403).send(error);
		}
		return handleError(res, 500, error, "logging in user");
	}
});
router.get("/watchlist", auth, async (req: AuthenticatedRequest, res) => {
	try {
		const id = req.user._id;
		if (!id) {
			return res.status(401).send("Unauthorized");
		}
		const user = await getUser(id);
		if (!user) {
			return res.status(401).send("User not found");
		}
		const tvPromises = user.watchList
			.filter((entry) => entry.type === "tv show")
			.map(async (entry) => {
				const showDetails = await getTVShow(entry.id);
				return { ...showDetails, watched: entry.watched };
			});

		const moviePromises = user.watchList
			.filter((entry) => entry.type === "movie")
			.map(async (entry) => {
				const movieDetails = await getMovie(entry.id);
				return { ...movieDetails, watched: entry.watched };
			});
		const tv = await Promise.all(tvPromises);
		const movies = await Promise.all(moviePromises);
		return res.status(200).send({ tv, movies });
	} catch (error) {
		return handleError(res, 500, error, "Error getting watchlist");
	}
});

// get all users
router.get("/", auth, async (req: AuthenticatedRequest, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).send("Unauthorized");
	}
	if (user.isAdmin === false) {
		return res.status(403).send("Forbidden");
	}
	try {
		const users = await getAllUsers();
		if (!users) {
			return res.status(404).send("No users found");
		}
		return res.status(200).send(users);
	} catch (error) {
		return handleError(res, 500, error, "Error getting all users");
	}
});

// get user by id
router.get("/:id", auth, async (req: AuthenticatedRequest, res) => {
	try {
		const currentUser = req.user;
		const id = req.params.id;
		if (!currentUser.isAdmin && currentUser._id !== id) {
			return res.status(403).send("You are not allowed to view this user");
		}
		const foundUser = await getUser(id);
		if (!foundUser) {
			return res.status(404).send("User not found");
		}
		return res.status(200).send(foundUser);
	} catch (error) {
		return handleError(res, 500, error, "Error getting user");
	}
});

// delete user by id
router.delete("/:id", auth, async (req: AuthenticatedRequest, res) => {
	const currentUser = req.user;
	try {
		const user = req.params.id;
		if (!currentUser.isAdmin && currentUser._id !== user) {
			return res.status(403).send("You are not allowed to delete this user");
		}
		const userData = await getUser(user);
		if (!userData) {
			return res.status(404).send("User not found");
		}
		if (userData.isAdmin) {
			return res.status(403).send("Not allowed to delete an admin user.");
		}
		await deleteUser(user);
		return res.status(204).send();
	} catch (error) {
		return handleError(res, 500, error, "Error deleting user");
	}
});

// update user by id
router.put("/:id", auth, async (req: AuthenticatedRequest, res) => {
	try {
		const id = req.params.id;
		const currentUser = req.user;
		const user = req.body;
		const userExistsID = await getUser(id);
		if (!userExistsID) {
			return res.status(404).send("User not found");
		}
		if (!currentUser.isAdmin && currentUser._id !== id) {
			return res.status(403).send("You are not allowed to update this user");
		}
		const userExistsEmail = await doesUserExist(user.email, "email");
		if (userExistsEmail && userExistsEmail._id.toString() !== id) {
			return res
				.status(400)
				.send("User already exists with this email or username");
		}
		const userExistsUsername = await doesUserExist(user.username, "username");
		if (userExistsUsername && userExistsUsername?._id.toString() !== id) {
			logger.error("User already exists with this username");
			return res
				.status(400)
				.send("User already exists with this email or username");
		}

		try {
			validateUser(user);
		} catch (error) {
			return handleZodError(res, error);
		}
		const updatedUser = await updateUser(id, user);
		return res.status(200).send(updatedUser);
	} catch (error) {
		return handleError(res, 500, error, "Error updating user");
	}
});

// refresh access token
router.post("/refresh-token", async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) return res.status(204);
		const decoded = verifyRefreshToken(refreshToken) as { _id: string };
		if (!decoded) return res.status(403).send("Invalid refresh token");
		const user = await getUser(decoded._id);
		const token = generateToken(user);
		return res.status(200).send(token);
	} catch (error) {
		return handleError(res, 500, error, "Error refreshing token");
	}
});

// logout
router.post("/logout", async (_req, res) => {
	try {
		res.clearCookie("refreshToken");
		return res.status(200).send("Logged out");
	} catch (error) {
		return handleError(res, 500, error, "Error logging out");
	}
});

// export default router /users/...
export default router;
