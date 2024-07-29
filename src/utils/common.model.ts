import { model, Schema } from "mongoose";
import { CastSchema } from "../credits/data/Cast.model.js";

type ICastAppearance = {
	role: string;
	castMember: string;
	appearedIn: string;
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
	castMember: CastSchema,
});

export const castAppearanceModel = model<ICastAppearance>(
	"CastAppearance",
	castAppearanceSchema,
);
