import { model, Schema } from "mongoose";
import type { ICastMember } from "../credits/data/Cast.model.js";
import type { IMovieDocument } from "../movies/data/Movie.model.js";
import type { ITVShowDocument } from "../tv/data/Tv.model.js";

type ICastAppearance = {
	role: string;
	castMemberID: Schema.Types.ObjectId | ICastMember;
	appearedIn: Schema.Types.ObjectId | IMovieDocument | ITVShowDocument;
	appearedInType: string;
	credit_id: string;
};

const castAppearanceSchema = new Schema({
	role: { type: String, required: true }, // Role can be character name or role like director
	castMemberID: {
		type: Schema.Types.ObjectId,
		ref: "castMember",
		required: true,
	},
	appearedIn: {
		type: Schema.Types.ObjectId,
		required: true,
		refPath: "appearedInType",
	}, // This will reference either a Movie or a Show
	appearedInType: { type: String, enum: ["movie", "tvshow"], required: true },
	credit_id: { type: String },
});

export const castAppearanceModel = model<ICastAppearance>(
	"CastAppearance",
	castAppearanceSchema,
);
