import { castAppearanceModel } from "../../utils/common.model.js";
import { CastModel, type ICastMember } from "./Cast.model.js";

export const processCredits = async (
	credits: ICastMember[],
	appearedInType: "movie" | "tvshow",
	appearedInID,
) => {
	try {
		const castMembers = [];

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
			profile_path: `https://image.tmdb.org/t/p/w200${credit.profile_path}`,
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
export const getCastByAppearanceId = async (appearanceId) => {
	try {
		const castAppearances = await castAppearanceModel
			.find({
				appearedIn: appearanceId,
			})
			.populate({ path: "castMemberID", model: "castMember" });
		return castAppearances;
	} catch (error) {
		console.error("Error getting cast:", error);
		throw error;
	}
};
