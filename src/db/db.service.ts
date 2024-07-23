import logger from "../utils/logger/logger.js";
import { closeConnection, connectToDB } from "./mongodb/connectToDB.js";

const DB = process.env.DB || "MONGODB";

export async function connectDB() {
	if (DB === "MONGODB") {
		return await connectToDB();
	}
	logger.error("DB not supported".red);
	return;
}

export async function closeDB() {
	if (DB === "MONGODB") {
		return await closeConnection();
	}
	logger.error("DB not supported".red);
	return;
}
