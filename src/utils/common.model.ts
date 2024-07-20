import mongoose from "mongoose";

export type ICastMember = {
	gender: 0 | 1 | 2;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string;
	character: string;
	credit_id: string;
	order: number;
};

export const CastSchema = new mongoose.Schema<ICastMember>({
	gender: { type: Number },
	id: { type: Number },
	known_for_department: { type: String },
	name: { type: String },
	original_name: { type: String },
	profile_path: { type: String },
	character: { type: String },
	credit_id: { type: String },
});
