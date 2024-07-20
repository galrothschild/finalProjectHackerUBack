import type { ICastMember } from "../../utils/common.model.js";
import type { IMovie } from "./Movie.model.js";

export const normalizeMovie = (movie: IMovie, cast: ICastMember[]): IMovie => {
	if (!movie.overview) {
		movie.overview = "No overview available";
	}
	if (!movie.poster_path) {
		movie.poster_path = "https://placehold.co/200x300?text=No\\nImage";
	} else {
		movie.poster_path = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
	}
	movie.cast = cast;
	return movie;
};
