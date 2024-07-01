import { getTVShowFromTMDB } from "../../tmdb/tmdb.api.service.js";
import { normalizeTVShow } from "./NormalizeTVShows.js";
import { type ITVShow, TVShowModel } from "./Tv.model.js";

export const getTVShow = async (id: string): Promise<ITVShow> => {
	try {
		const tvShow = await TVShowModel.findOne({ id });
		if (tvShow) {
			return tvShow;
		}
		const tvShowFromTMDB = await getTVShowFromTMDB(id);
		if (!tvShowFromTMDB) {
			return null;
		}
		if (tvShowFromTMDB.status_code === 34) {
			return null;
		}
		const normalizedTVShow = normalizeTVShow(tvShowFromTMDB);
		const newTVShow = new TVShowModel(normalizedTVShow);
		return await newTVShow.save();
	} catch (error) {
		return Promise.reject(error);
	}
};
