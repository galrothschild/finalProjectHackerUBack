import "./config";
import express from "express";
import router from "./router/router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((err, _req, _res, next) => {
	next(err);
});

const port = process.env.PORT || 1234;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

export default app;
