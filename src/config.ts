import dotenv from "dotenv";
import path from "node:path";

if (process.env.NODE_ENV === "test") {
	dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
}
