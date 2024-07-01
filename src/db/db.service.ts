import { closeConnection, connectToDB } from "./mongodb/connectToDB.js";

const DB = process.env.DB || "MONGODB";

export async function connectDB() {
	if (DB === "MONGODB") {
		return await connectToDB();
	}
	console.log("DB not supported".red);
	return;
}

export async function closeDB() {
	if (DB === "MONGODB") {
		return await closeConnection();
	}
	console.log("DB not supported".red);
	return;
}
