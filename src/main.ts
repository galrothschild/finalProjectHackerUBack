import "./config";
import express, { NextFunction, Response } from "express";
import router from "./router/router.js";
import "colors";
import { closeDB, connectDB } from "./db/db.service.js";
import { handleError } from "./utils/handleError.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((err: unknown, _req, res: Response, _next: NextFunction) => {
	const statusCode = +res.status || 500;
	handleError(res, statusCode, err, "handling error");
});

const port = process.env.PORT || 1234;

app.listen(port, async () => {
	console.log(`Server is running on http://localhost:${port}`.green);
	try {
		await connectDB();
	} catch (error) {
		console.log(`Error connecting to DB: ${error}`.red);
	}
});

export default app;
