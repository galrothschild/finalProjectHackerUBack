import { Router } from "express";
import { createUser } from "../data/usersDataAccess.service.js";

const router = Router();

router.post("/", async (req, res) => {
	try {
		const user = req.body;
		createUser(user);
		res.status(201).send("User created");
	} catch (error) {
		res.status(500).send("Error creating user");
	}
});

export default router;
