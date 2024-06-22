import { Router } from "express";
import { createUser, deleteUser } from "../data/usersDataAccess.service.js";
import { handleError } from "../../utils/handleError.js";

const router = Router();

router.post("/", async (req, res) => {
	try {
		console.log("Received request to create user:".bgGreen, req.body);
		const user = req.body;
		const createdUser = await createUser(user);
		return res.status(201).send(createdUser);
	} catch (error) {
		return handleError(res, 500, error, "Error creating user");
	}
});

router.delete("/:id", async (req, res) => {
	try {
		console.log("Received request to delete user:".bgGreen, req.params.id);
		const user = req.params.id;
		await deleteUser(user);
		return res.status(204).send("User deleted");
	} catch (error) {
		return handleError(res, 500, error, "Error deleting user");
	}
});

export default router;
