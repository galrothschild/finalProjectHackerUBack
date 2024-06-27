import { getMovieFromTMDB } from "../../tmdb/tmdb.api.service.js";
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
    const normalizedMovie = normalizeMovie(movieFromTMDB);
      const newMovie = new MovieModel(normalizedMovie);
      return await newMovie.save();
	} catch (error) {
		return Promise.reject(error);
	}
};
