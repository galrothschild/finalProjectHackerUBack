import { Router } from "express";
import { getTVShowsFromTMDB } from "../tmdb/tmdb.api.service.js";
import { getTVShow } from "./data/TVDataAccess.service.js";

const router = Router();

// get list of popular movies
router.get("/", async (req, res, next) => {
	try {
		const pageNumber = req.query.page || 1;
		const query = req.query.query ? req.query.query.toString() : "";
		if (+pageNumber < 1 || Number.isNaN(+pageNumber)) {
			res.status(400).send("Invalid page number");
			return;
		}
		const movies = await getTVShowsFromTMDB(+pageNumber, query);
		Promise.all(movies.results.map((movie) => getTVShow(movie.id))).then(
			(fullMovies) => {
				return res.send({
					results: fullMovies,
					total_pages: movies.total_pages,
				});
			},
		);
	} catch (error) {
		return next(error);
	}
});

// get a single movie by id
router.get("/:id", async (req, res, next) => {
	try {
		if (!req.params.id || Number.isNaN(+req.params.id) || +req.params.id < 1) {
			return res.status(400).send("Invalid movie id");
		}
		const movie = await getTVShow(req.params.id);
		if (movie) {
			return res.status(200).send(movie);
		}
		return res.status(404).send("Movie not found");
	} catch (error) {
		return next(error);
	}
});
export default router;
