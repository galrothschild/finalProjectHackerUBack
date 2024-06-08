import express from "express";
const app = express();
import router from "./routes/router.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

export default app;
