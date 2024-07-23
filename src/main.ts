import "./config";
import express, { type NextFunction, type Response } from "express";
import router from "./router/router.js";
import "colors";
import { connectDB } from "./db/db.service.js";
import { handleError } from "./utils/handleError.js";
import cors from "cors";
import { swaggerDocs } from "./swagger.config.js";
import cookieParser from "cookie-parser";
import logger from "./utils/logger/logger.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logLevel = process.env.LOG_LEVEL || "error";
app.use((req, _res, next) => {
	if (process.env.NODE_ENV === "test" || logLevel !== "debug") {
		return next();
	}
	logger.info(`${req.method} ${req.path}`);
	next();
});

app.use((err: unknown, _req, res: Response, _next: NextFunction) => {
	const statusCode = +res.status || 500;
	handleError(res, statusCode, err, "handling error");
});
app.use(router);

const port = +process.env.PORT || 1234;

app.listen(port, async () => {
	logger.info(`Server is running on http://localhost:${port}`.green.bold);
	try {
		await connectDB();
		swaggerDocs(app, port);
	} catch (error) {
		logger.error(`Error connecting to DB: ${error}`);
	}
});

export default app;
