import { connectToDB } from "./mongodb/connectToDB.js";

const DB = process.env.DB || "MONGODB";

export async function connectDB() {
	if (DB === "MONGODB") {
		return await connectToDB();
	}
	console.log("DB not supported".red);
	return;
}
