import { Router } from "express";
import { getMoviesFromTMDB } from "../tmdb/tmdb.api.service.js";
import { getMovie } from "./data/movieDataAccess.service.js";

const router = Router();

// get list of popular movies
router.get("/", async (req, res) => {
	const pageNumber = +req.body.page || 1;
	if (pageNumber < 1 || Number.isNaN(pageNumber)) {
		res.status(400).send("Invalid page number");
		return;
	}
	const movies = await getMoviesFromTMDB(pageNumber);
  Promise.all(movies.results.map((movie) => getMovie(movie.id))).then((fullMovies) => {
    return res.send(fullMovies);
  });
});

// get a single movie by id
router.get("/:id", async (req, res) => {
	if (!req.params.id || Number.isNaN(req.params.id)) {
		return res.status(400).send("Invalid movie id");
	}
	const movie = await getMovie(req.params.id);
	if (movie) {
		return res.status(200).send(movie);
	}
	return res.status(404).send("Movie not found");
});
export default router;
