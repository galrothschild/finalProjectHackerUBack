import app from "../../main.js";
import { saveMovie } from "../../movies/data/movieDataAccess.service.js";
import { getCreditsByCastMemberFromTMDB } from "../../tmdb/tmdb.api.service.js";
import { saveTVShow } from "../../tv/data/TVDataAccess.service.js";
import { castAppearanceModel } from "../../utils/common.model.js";
import logger from "../../utils/logger/logger.js";
import { CastModel, type ICastMember } from "./Cast.model.js";

export const processCredits = async (
	credits: ICastMember[],
	appearedInType: "movie" | "tvshow",
	appearedInID,
) => {
	try {
		if (!Array.isArray(credits) || credits.length === 0) {
			return false;
		}
		const castMembers = [];
		if (appearedInType === "tvshow") {
			credits.map((credit) => {
				credit.character = credit.roles[0].character;
			});
		}

		for (const credit of credits) {
			const castMember = await processCastMember(credit);
			castMembers.push(castMember);
		}
		castMembers.map((castMember) => {
			castMember.appearedIn = appearedInID;
			castMember.appearedInType = appearedInType;
		});
		castMembers.map((castMember) => {
			if (!castMember.role) {
				castMember.role = "Role Not Found";
			}
		});
		await castAppearanceModel.insertMany(castMembers);
		return true;
	} catch (error) {
		return Promise.reject(error);
	}
};

const processCastMember = async (credit: ICastMember) => {
	try {
		const castMember = await CastModel.findOne({ id: credit.id }).lean();
		if (castMember) {
			return {
				castMemberID: castMember._id,
				credit_id: credit.credit_id,
				role: credit.character || credit.job,
			};
		}

		const newCastMember = new CastModel({
			...credit,
			profile_path: credit.profile_path
				? `https://image.tmdb.org/t/p/w200${credit.profile_path}`
				: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
		});
		const castMemberDocumnent = await newCastMember.save();
		return {
			castMemberID: castMemberDocumnent._id,
			credit_id: credit.credit_id,
			role: credit.character || credit.job,
		};
	} catch (error) {
		return Promise.reject(error);
	}
};
export const getCastByAppearanceId = async (
	appearedInID,
	type: "movie" | "tvshow",
) => {
	try {
		const castAppearances = await castAppearanceModel
			.find({
				appearedIn: appearedInID,
				appearedInType: type,
			})
			.populate({ path: "castMemberID", model: "castMember" });
		return castAppearances.map((castAppearance) => {
			return {
				...castAppearance.toObject().castMemberID,
				role: castAppearance.role,
			};
		});
	} catch (error) {
		logger.error("Error getting cast:", error);
		return Promise.reject(error);
	}
};

export const getCreditsByCastMemberId = async (castMemberID) => {
	try {
		const castAppearances = await castAppearanceModel
			.find({ castMemberID })
			.populate({ path: "appearedIn" });
		return castAppearances.map((castAppearance) => {
			return {
				...castAppearance.toObject().appearedIn,
				role: castAppearance.role,
				type: castAppearance.appearedInType,
			};
		});
	} catch (error) {
		logger.error("Error getting credits:", error);
		return Promise.reject(error);
	}
};

export const getCastMember = async (id) => {
	try {
		const castMember = await CastModel.findOne({ id }).lean();
		return castMember;
	} catch (error) {
		logger.error("Error getting cast member:", error);
		return Promise.reject(error);
	}
};

export const loadCastMemberCredits = async (id) => {
	try {
		const castAppearancesFromTMDB = await getCreditsByCastMemberFromTMDB(id);
		const promises = castAppearancesFromTMDB.map((credit) => {
			if (credit.media_type === "tv") {
				return saveTVShow(credit.id);
			}
			if (credit.media_type === "movie") {
				return saveMovie(credit.id);
			}
		});
		await Promise.all(promises);

		return true;
	} catch (error) {
		logger.error("Error getting cast member credits:", error);
		return Promise.reject(error);
	}
};
