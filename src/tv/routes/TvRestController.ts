import { Router } from "express";
import {
	getFilteredFromTMDB,
	getFromTMDB,
	getGenresFromTMDB,
	getTVShowFromTMDB,
} from "../../tmdb/tmdb.api.service.js";
import {
	getTVShow,
	getTVShowCreditsFromDB,
	patchUsersTVShows,
} from "../data/TVDataAccess.service.js";
import { auth, type AuthenticatedRequest } from "../../auth/auth.service.js";
import { getUser } from "../../users/data/usersDataAccess.service.js";

const router = Router();

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

router.get("/genres", async (_req, res, next) => {
	try {
		const genres = await getGenresFromTMDB("tv");
		return res.send(genres.genres);
	} catch (error) {
		return next(error);
	}
});

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

router.get("/:id/credits", async (req, res, next) => {
	try {
		if (!req.params.id || Number.isNaN(+req.params.id) || +req.params.id < 1) {
			return res.status(400).send("Invalid show id");
		}
		const show = await getTVShow(req.params.id);
		if (!show || !show._id) {
			return res.status(404).send("Show not found");
		}
		const showCredits = await getTVShowCreditsFromDB(show._id as string);
		if (showCredits) {
			return res.status(200).send(showCredits);
		}
		return res.status(404).send("Show not found");
	} catch (error) {
		return next(error);
	}
});

router.patch("/:id", auth, async (req: AuthenticatedRequest, res, next) => {
	const userId = req.user?._id;
	const showId = req.params.id;
	try {
		const show = await getTVShow(showId);
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
		const watched = await patchUsersTVShows(user, showId, false);
		return res
			.status(200)
			.send(watched ? "Added to watchList" : "Removed from watchList");
	} catch (error) {
		return next(error);
	}
});

router.patch(
	"/:id/watched",
	auth,
	async (req: AuthenticatedRequest, res, next) => {
		const userId = req.user?._id;
		const showId = req.params.id;
		try {
			const show = await getTVShow(showId);
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
			const watched = await patchUsersTVShows(user, showId, true);
			return res
				.status(200)
				.send(
					watched
						? "Added to watched TV Shows"
						: "Removed from watched TV Shows",
				);
		} catch (error) {
			return next(error);
		}
	},
);

// export the router /tv/...
export default router;
