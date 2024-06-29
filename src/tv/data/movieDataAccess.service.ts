import { getMovieFromTMDB } from "../../tmdb/tmdb.api.service.js";
import { MovieModel, type IMovie } from "./Tv.model.js";
import { normalizeMovie } from "./NormalizeTVShows.js";

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
