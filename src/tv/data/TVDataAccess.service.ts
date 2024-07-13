import { getTVShowFromTMDB } from "../../tmdb/tmdb.api.service.js";
import type { IUserDocument } from "../../users/data/User.model.js";
import { updateUser } from "../../users/data/usersDataAccess.service.js";
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

export const patchUsersTVShows = async (
	user: IUserDocument,
	movieId: string,
	watched: boolean,
) => {
	const userID = user._id as string;
	const watchedList = watched ? "watched" : "watchList";
	const index = user[watchedList].findIndex(
		(watchListEntry) => watchListEntry.id === movieId,
	);
	let added = false;
	if (index === -1) {
		user?.[watchedList].push({ id: movieId, type: "tv show" });
		added = true;
	} else {
		user?.[watchedList].splice(index, 1);
	}
	await updateUser(userID, user);
	return added;
};
