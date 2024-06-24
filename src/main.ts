import "./config";
import express from "express";
import router from "./router/router.js";
import "colors";
import { connectDB } from "./db/db.service.js";
import { handleError } from "./utils/handleError.js";
import cors from "cors";


const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((err, _req, _res, next) => {
	handleError(_res, 500, err, "handling error");
	next(err);
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
