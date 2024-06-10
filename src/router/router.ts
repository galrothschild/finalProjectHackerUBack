import { Router } from "express";
import movieRouter from "../movies/moviesRestController.js";
import userRouter from "../users/routes/usersRestController.js";

const router = Router();

router.use("/movies", movieRouter);
router.use("/users", userRouter);

export default router;
