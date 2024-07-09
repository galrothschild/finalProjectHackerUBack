import { Router } from "express";
import {
	getFilteredFromTMDB,
	getFromTMDB,
	getGenresFromTMDB,
	getTVShowsFromTMDB,
} from "../../tmdb/tmdb.api.service.js";
import { getTVShow } from "../data/TVDataAccess.service.js";
import { handleError } from "../../utils/handleError.js";
import { auth } from "../../auth/auth.service.js";

const router = Router();

/**
 * @openapi
 * /tv:
 *   get:
 *     description: Will get a list of tv shows
 *     parameters:
 *      - name: page
 *        in: query
 *        description: optional page number, if it doesn't exist it will default to 1
 *        schema:
 *          type: number
 *     responses:
 *        200:
 *          description: Returns a list of tv shows.
 *        400:
 *          description: Invalid Page number
 *
 */
router.get("/", async (req, res, next) => {
	try {
		const pageNumber = req.query.page || 1;
		const query = req.query.query ? req.query.query.toString() : "";
		if (+pageNumber < 1 || Number.isNaN(+pageNumber)) {
			res.status(400).send("Invalid page number");
			return;
		}
		const shows = await getFromTMDB(+pageNumber, "tv", query);
		Promise.all(shows.results.map((show) => getTVShow(show.id))).then(
			(fullShows) => {
				return res.send({
					results: fullShows,
					total_pages: shows.total_pages,
				});
			},
		);
	} catch (error) {
		return next(error);
	}
});

/**
 * @openapi
 * /shows/filter:
 *   get:
 *     description: Will get a list of shows by genre
 *     parameters:
 *      - name: genres
 *        in: query
 *        description: genres
 *        required: true
 *        schema:
 *         type: string
 *         pattern: '^[0-9]+(?:,[0-9]+)*$'
 *         example: 28,12
 *      - name: page
 *        in: query
 *        description: optional page number, if it doesn't exist it will default to 1
 *        schema:
 *         type: number
 *         example: 1
 *         required: false
 *     responses:
 *        200:
 *          description: Returns a list of shows.
 *        400:
 *          description: Invalid filter
 *
 */

router.get("/filter", async (req, res, next) => {
	try {
		const filter = req.query.genres.toString();
		const pageNumber = req.query.page === "undefined" ? 1 : req.query.page || 1;
		if (!filter || /^[0-9,]+$/.test(filter) === false) {
			return res.status(400).send("Invalid filter");
		}
		if (+pageNumber < 1 || Number.isNaN(+pageNumber)) {
			return res.status(400).send("Invalid page number");
		}
		const shows = await getFilteredFromTMDB(filter, "tv", +pageNumber);
		Promise.all(shows.results.map((show) => getTVShow(show.id))).then(
			(fullShows) => {
				return res.send({
					results: fullShows,
					total_pages: shows.total_pages,
				});
			},
		);
	} catch (error) {
		return next(error);
	}
});

/**
 * @openapi
 * /movies/genres:
 *   get:
 *     description: Will get a list of movie genres
 *     responses:
 *        200:
 *          description: Returns a list of genres.
 *
 *
 */

router.get("/genres", async (_req, res, next) => {
	try {
		const genres = await getGenresFromTMDB("tv");
		return res.send(genres.genres);
	} catch (error) {
		return next(error);
	}
});

/**
 * @openapi
 * /tv/{id}:
 *   get:
 *     description: Will get a tv show by ID
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id
 *        schema:
 *          type: number
 *     responses:
 *        200:
 *          description: Returns details about a tv show.
 *        400:
 *          description: Invalid tv show ID
 *        404:
 *          description: Tv show not found
 *
 */
router.get("/:id", async (req, res, next) => {
	try {
		if (!req.params.id || Number.isNaN(+req.params.id) || +req.params.id < 1) {
			return res.status(400).send("Invalid show id");
		}
		const show = await getTVShow(req.params.id);
		if (show) {
			return res.status(200).send(show);
		}
		return res.status(404).send("Show not found");
	} catch (error) {
		return next(error);
	}
});

router.patch("/:id/watched", auth, async (req, res, next) => {
	// req.user.watched.push({req.params.id);
});
export default router;
