import type { ITVShow } from "./Tv.model.js";

export const normalizeTVShow = (show: ITVShow): ITVShow => {
	if (!show.overview) {
		show.overview = "No overview available";
	}
	if (!show.poster_path) {
		show.poster_path = "https://placehold.co/200x300?text=No\\nImage";
	} else {
		show.poster_path = `https://image.tmdb.org/t/p/w200${show.poster_path}`;
	}
	return show;
};
