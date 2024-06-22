import mongoose from "mongoose";

export const connectToDB = async () => {
	const MONGO_URI =
		process.env.MONGO_URI || "mongodb://localhost:27017/MyMovies";
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to MongoDB".magenta);
	} catch (error) {
		console.log(`Error connecting to MongoDB: ${error}`.red);
	}
};
