import { connectToDB } from "./mongodb/connectToDB.js";
import chalk from "chalk";

const DB = process.env.DB || "MONGODB";

export async function connectDB() {
	if (DB === "MONGODB") {
		return await connectToDB();
	}
	console.log(chalk.redBright("DB not supported"));
	return;
}
