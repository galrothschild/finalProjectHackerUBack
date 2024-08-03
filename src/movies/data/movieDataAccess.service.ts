import {
	getCastByAppearanceId,
	processCredits,
} from "../../credits/data/castDataAccess.service.js";
import {
	getCreditsFromTMDB,
	getMovieFromTMDB,
} from "../../tmdb/tmdb.api.service.js";
import type { IUserDocument } from "../../users/data/User.model.js";
import { updateUser } from "../../users/data/usersDataAccess.service.js";
import { type IMovieDocument, MovieModel } from "./Movie.model.js";
import { normalizeMovie } from "./normalizeMovie.js";

export const getMovie = async (id: string): Promise<IMovieDocument> => {
	try {
		const movie = await MovieModel.findOne({ id }).lean();
		if (movie) {
			return movie;
		}
		const movieFromTMDB = await getMovieFromTMDB(id);
		if (!movieFromTMDB) {
			return null;
		}
		if (movieFromTMDB.status_code === 34) {
			return null;
		}
		const cast = await getMovieCredits(id);
		const normalizedMovie = normalizeMovie(movieFromTMDB);
		const newMovie = new MovieModel(normalizedMovie);
		processCredits(cast, "movie", newMovie._id);
		return await newMovie.save();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const patchUsersMovies = async (
	user: IUserDocument,
	movieId: string,
	watched: boolean,
) => {
	const userID = user._id.toString();
	const index = user.watchList.findIndex(
		(watchListEntry) =>
			watchListEntry.id === movieId && watchListEntry.type === "movie",
	);
	let added = false;

	if (index === -1) {
		// Movie not in watchList, add it
		user.watchList.push({ id: movieId, type: "movie", watched });
		added = true;
	} else if (user.watchList[index].watched === watched) {
		// If the status is already the same, remove the entry
		user.watchList.splice(index, 1);
	} else {
		// Update the watched status
		user.watchList[index].watched = watched;
	}

	// Save the user object to the database
	await updateUser(userID, user);
	return added;
};

export const getMovieCredits = async (id: string) => {
	try {
		const credits = await getCreditsFromTMDB(id, "movie");
		if (!credits) {
			return null;
		}
		return credits.cast;
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getMovieCreditsFromDB = async (id: string) => {
	try {
		const movie = await MovieModel.findOne({ _id: id }).lean();
		if (!movie) {
			return null;
		}
		return { cast: await getCastByAppearanceId(id, "movie") };
	} catch (error) {
		return Promise.reject(error);
	}
};
