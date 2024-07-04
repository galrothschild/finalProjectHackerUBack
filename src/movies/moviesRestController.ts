import { Router } from "express";
import { getMoviesFromTMDB } from "../tmdb/tmdb.api.service.js";
import { getMovie } from "./data/movieDataAccess.service.js";

const router = Router();

/**
 * @openapi
 * /movies:
 *   get:
 *     description: Will get a list of movies
 *     parameters:
 *      - name: page
 *        in: query
 *        description: optional page number, if it doesn't exist it will default to 1
 *        schema:
 *          type: number
 *     responses:
 *        200:
 *          description: Returns a list of movies.
 *        400:
 *          description: Invalid Page number
 *
 */
router.get("/", async (req, res, next) => {
	try {
		const pageNumber = req.query.page || 1;
		const query = req.query.query ? req.query.query.toString() : "";
		if (+pageNumber < 1 || Number.isNaN(+pageNumber)) {
			return res.status(400).send("Invalid page number");
		}
		const movies = await getMoviesFromTMDB(+pageNumber, query);
		Promise.all(movies.results.map((movie) => getMovie(movie.id))).then(
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
		const movie = await getMovie(req.params.id);
		if (movie) {
			return res.status(200).send(movie);
		}
		return res.status(404).send("Movie not found");
	} catch (error) {
		return next(error);
	}
});
export default router;
