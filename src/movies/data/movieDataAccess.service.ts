import { getMovieFromTMDB } from "../../tmdb/tmdb.api.service.js";
import type { IUser, IUserDocument } from "../../users/data/User.model.js";
import { updateUser } from "../../users/data/usersDataAccess.service.js";
import { MovieModel, type IMovie } from "./Movie.model.js";
import { normalizeMovie } from "./normalizeMovie.js";

export const getMovie = async (id: string): Promise<IMovie> => {
	try {
		const movie = await MovieModel.findOne({ id });
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
		const normalizedMovie = normalizeMovie(movieFromTMDB);
		const newMovie = new MovieModel(normalizedMovie);
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
	const userID = user._id as string;
	const index = user.watchList.findIndex(
		(watchListEntry) =>
			watchListEntry.id === movieId && watchListEntry.type === "movie",
	);
	let added = false;
	if (index === -1) {
		user.watchList.push({ id: movieId, type: "movie", watched });
		added = true;
	} else if (user.watchList[index].watched === watched) {
		user.watchList.splice(index, 1);
	} else {
		user.watchList[index].watched = watched;
	}
	await updateUser(userID, user);
	return added;
};
