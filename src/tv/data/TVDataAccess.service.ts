import {
	getCastByAppearanceId,
	processCredits,
} from "../../credits/data/castDataAccess.service.js";
import {
	getCreditsFromTMDB,
	getTVShowFromTMDB,
} from "../../tmdb/tmdb.api.service.js";
import type { IUserDocument } from "../../users/data/User.model.js";
import { updateUser } from "../../users/data/usersDataAccess.service.js";
import { normalizeTVShow } from "./NormalizeTVShows.js";
import { type ITVShowDocument, TVShowModel } from "./Tv.model.js";

export const getTVShow = async (id: string): Promise<ITVShowDocument> => {
	try {
		const tvShow = await TVShowModel.findOne({ id }).lean();
		if (tvShow) {
			return tvShow;
		}
		const newTVShow = await saveTVShow(id);
		if (!newTVShow) {
			return null;
		}
		return await TVShowModel.findOne({ id }).lean();
	} catch (error) {
		return Promise.reject(error);
	}
};
export const saveTVShow = async (id: string) => {
	try {
		const tvShow = await TVShowModel.findOne({ id });
		if (tvShow) {
			return true;
		}
		const tvShowFromTMDB = await getTVShowFromTMDB(id);
		if (!tvShowFromTMDB || !tvShowFromTMDB.id || !tvShowFromTMDB.name) {
			return null;
		}
		if (tvShowFromTMDB.status_code === 34) {
			return null;
		}
		const cast = await getTVShowCredits(id);
		const normalizedTVShow = normalizeTVShow(tvShowFromTMDB);
		const newTVShow = new TVShowModel(normalizedTVShow);
		processCredits(cast, "tvshow", newTVShow._id);
		await newTVShow.save();
		return true;
	} catch (error) {
		return Promise.reject(error);
	}
};

export const patchUsersTVShows = async (
	user: IUserDocument,
	showId: string,
	watched: boolean,
) => {
	const userID = user._id as string;
	const index = user.watchList.findIndex(
		(watchListEntry) =>
			watchListEntry.id === showId && watchListEntry.type === "tv show",
	);
	let added = false;
	if (index === -1) {
		user.watchList.push({ id: showId, type: "tv show", watched });
		added = true;
	} else if (user.watchList[index].watched === watched) {
		user.watchList.splice(index, 1);
	} else {
		user.watchList[index].watched = watched;
	}
	await updateUser(userID, user);
	return added;
};

export const getTVShowCredits = async (id: string) => {
	try {
		const credits = await getCreditsFromTMDB(id, "tv");
		if (!credits) {
			return null;
		}
		return credits.cast;
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getTVShowCreditsFromDB = async (id: string) => {
	try {
		const tvShow = await TVShowModel.findOne({ _id: id }).lean();
		if (!tvShow) {
			return null;
		}
		return await getCastByAppearanceId(id, "tvshow");
	} catch (error) {
		return Promise.reject(error);
	}
};
