import "./config";
import express, { type NextFunction, type Response } from "express";
import router from "./router/router.js";
import "colors";
import { connectDB } from "./db/db.service.js";
import { handleError } from "./utils/handleError.js";
import cors from "cors";
import { swaggerDocs } from "./swagger.config.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((err: unknown, _req, res: Response, _next: NextFunction) => {
	const statusCode = +res.status || 500;
	handleError(res, statusCode, err, "handling error");
});

const port = +process.env.PORT || 1234;

app.listen(port, async () => {
	console.log(`Server is running on http://localhost:${port}`.green);
	try {
		await connectDB();
		swaggerDocs(app, port);
	} catch (error) {
		console.log(`Error connecting to DB: ${error}`.red);
	}
});

export default app;
