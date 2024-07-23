import mongoose from "mongoose";
import logger from "../../utils/logger/logger.js";

export const connectToDB = async () => {
	const MONGO_URI =
		process.env.MONGO_URI || "mongodb://localhost:27017/MyMovies";
	try {
		await mongoose.connect(MONGO_URI);
		logger.info("Connected to MongoDB".magenta);
	} catch (error) {
		logger.error(`Error connecting to MongoDB: ${error}`.red);
	}
};

export const closeConnection = async () => {
	await mongoose.connection.close();
	logger.info("Disconnected from MongoDB".magenta);
};
