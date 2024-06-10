import "./config";
import express from "express";
import router from "./router/router.js";
import chalk from "chalk";
import { connectDB } from "./db/db.service.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((err, _req, _res, next) => {
	next(err);
});

const port = process.env.PORT || 1234;
app.listen(port, async () => {
	console.log(
		chalk.greenBright(`Server is running on http://localhost:${port}`),
	);
	try {
		await connectDB();
	} catch (error) {
		console.log(chalk.redBright(`Error connecting to DB: ${error}`));
	}
});

export default app;
