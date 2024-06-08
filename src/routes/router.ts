import { Router } from "express";
import movieRouter from "./movies/moviesRestController.js";

const router = Router();

router.use("/movies", movieRouter);

export default router;
