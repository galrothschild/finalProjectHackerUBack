import { Router } from "express";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getUser,
	updateUser,
} from "../data/usersDataAccess.service.js";
import { handleError } from "../../utils/handleError.js";

const router = Router();

router.post("/", async (req, res) => {
	try {
		const user = req.body;
		const createdUser = await createUser(user);
		return res.status(201).json(createdUser);
	} catch (error) {
		return handleError(res, 500, error, "Error creating user");
	}
});

// get all users
router.get("/", async (_req, res) => {
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
router.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const foundUser = await getUser(id);
		if (!foundUser) {
			return res.status(404).send("User not found");
		}
		return res.status(200).send(foundUser);
	} catch (error) {
		return handleError(res, 500, error, "Error getting user");
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const user = req.params.id;
		await deleteUser(user);
		return res.status(204).send();
	} catch (error) {
		return handleError(res, 500, error, "Error deleting user");
	}
});

router.put("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const user = req.body;
		const updatedUser = await updateUser(id, user);
		return res.status(200).send(updatedUser);
	} catch (error) {
		return handleError(res, 500, error, "Error updating user");
	}
});

export default router;
