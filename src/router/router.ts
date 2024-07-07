import { Router } from "express";
import movieRouter from "../movies/routes/moviesRestController.js";
import userRouter from "../users/routes/usersRestController.js";
import tvRouter from "../tv/routes/TvRestController.js";

const router = Router();

router.use("/movies", movieRouter);
router.use("/tv", tvRouter);
router.use("/users", userRouter);

export default router;
