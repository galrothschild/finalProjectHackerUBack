import { Router } from "express";
import { getMovie, getMovies } from "../apiService/tmdb.api.service.js";

const router = Router();

// get list of popular movies
router.get("/", async (_req, res) => {
	const movies = await getMovies(1);
	if (movies) {
		res.send(movies);
	}
});

// get a single movie by id
router.get("/:id", async (req, res) => {
	if (!req.params.id || Number.isNaN(req.params.id)) {
		res.status(400).send("Invalid movie id");
		return;
	}
	const movie = await getMovie(req.params.id);
	if (movie) {
		res.send(movie);
	}
});
export default router;
