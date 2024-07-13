import { Router } from "express";
import {
	getFilteredFromTMDB,
	getFromTMDB,
	getGenresFromTMDB,
} from "../../tmdb/tmdb.api.service.js";
import { getMovie } from "../data/movieDataAccess.service.js";
import { auth, type AuthenticatedRequest } from "../../auth/auth.service.js";
import {
	getUser,
	updateUser,
} from "../../users/data/usersDataAccess.service.js";

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
		const movies = await getFromTMDB(+pageNumber, "movie", query);
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

/**
 * @openapi
 * /movies/filter:
 *   get:
 *     description: Will get a list of movies by genre
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
 *          description: Returns a list of movies.
 *        400:
 *          description: Invalid filter
 *
 */

router.get("/filter", async (req, res, next) => {
	try {
		const filter = req.query.genres.toString();
		const pageNumber = req.query.page || 1;
		if (!filter || /^[0-9]+(?:,[0-9]+)*$/.test(filter) === false) {
			return res.status(400).send("Invalid filter");
		}
		if (+pageNumber < 1 || Number.isNaN(+pageNumber)) {
			return res.status(400).send("Invalid page number");
		}
		const movies = await getFilteredFromTMDB(filter, "movie", +pageNumber);
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
		const genres = await getGenresFromTMDB("movie");
		return res.send(genres.genres);
	} catch (error) {
		return next(error);
	}
});

/**
 * @openapi
 * /movies/{id}:
 *   get:
 *     description: Will get a movie by ID
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id
 *        required: true
 *        schema:
 *          type: number
 *        responses:
 *        200:
 *          description: Returns details about a movie.
 *        400:
 *          description: Invalid movie ID
 *        404:
 *          description: Movie not found
 *
 */
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

router.patch("/:id", auth, async (req: AuthenticatedRequest, res, next) => {
	const userId = req.user?._id;
	const movieId = req.params.id;
	try {
		const show = await getMovie(movieId);
		if (!show) {
			return res.status(404).send("Show not found");
		}
		if (!userId) {
			return res.status(401).send("Unauthorized");
		}
		const user = await getUser(userId);
		if (!user) {
			return res.status(401).send("User not found");
		}
		let watchListed = false;
		if (!user.watchList.includes({ id: movieId, type: "movie" })) {
			user.watchList.push({ id: movieId, type: "movie" });
			watchListed = true;
		} else {
			user.watchList = user.watchList.splice(
				user.watchList.indexOf({ id: movieId, type: "movie" }),
				1,
			);
		}
		await updateUser(userId, user);
		return res
			.status(200)
			.send(watchListed ? "Added to watchlist" : "Removed from watchlist");
	} catch (error) {
		return next(error);
	}
});

router.patch(
	"/:id/watched",
	auth,
	async (req: AuthenticatedRequest, res, next) => {
		const userId = req.user?._id;
		const movieId = req.params.id;
		try {
			const show = await getMovie(movieId);
			if (!show) {
				return res.status(404).send("Show not found");
			}
			if (!userId) {
				return res.status(401).send("Unauthorized");
			}
			const user = await getUser(userId);
			if (!user) {
				return res.status(401).send("User not found");
			}
			let watched = false;
			if (!user.watched.includes({ id: movieId, type: "movie" })) {
				user.watched.push({ id: movieId, type: "movie" });
				watched = true;
			} else {
				user.watched = user.watched.splice(
					user.watched.indexOf({ id: movieId, type: "movie" }),
					1,
				);
			}
			await updateUser(userId, user);
			return res
				.status(200)
				.send(
					watched ? "Added to watched movies" : "Removed from watched movies",
				);
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
