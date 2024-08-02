import { Router } from "express";
import {
	getFilteredFromTMDB,
	getFromTMDB,
	getGenresFromTMDB,
} from "../../tmdb/tmdb.api.service.js";
import {
	getMovie,
	getMovieCreditsFromDB,
	patchUsersMovies,
} from "../data/movieDataAccess.service.js";
import { auth, type AuthenticatedRequest } from "../../auth/auth.service.js";
import { getUser } from "../../users/data/usersDataAccess.service.js";

const router = Router();

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

router.get("/genres", async (_req, res, next) => {
	try {
		const genres = await getGenresFromTMDB("movie");
		return res.send(genres.genres);
	} catch (error) {
		return next(error);
	}
});

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

router.get("/:id/credits", async (req, res, next) => {
	try {
		if (!req.params.id || Number.isNaN(+req.params.id) || +req.params.id < 1) {
			return res.status(400).send("Invalid movie id");
		}
		const movie = await getMovie(req.params.id);
		if (!movie || !movie._id) {
			return res.status(404).send("Movie not found");
		}
		const movieCredits = await getMovieCreditsFromDB(movie._id as string);
		if (movieCredits) {
			return res.status(200).send(movieCredits);
		}
		return res.status(404).send("Movie not found");
	} catch (error) {
		return next(error);
	}
});

router.patch("/:id", auth, async (req: AuthenticatedRequest, res, next) => {
	const userId = req.user?._id;
	const movieId = req.params.id;
	if (Number.isNaN(+movieId) || +movieId < 1) {
		return res.status(400).send("Invalid movie id");
	}
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
		const watchListed = await patchUsersMovies(user, movieId, false);

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
			const watched = await patchUsersMovies(user, movieId, true);
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

// export default router /movies/...
export default router;
