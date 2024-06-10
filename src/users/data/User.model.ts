import mongoose from "mongoose";

export type IUser = {
	username: string;
	email: string;
	password: string;
	image: string;
	name: {
		first: string;
		last: string;
		middle?: string;
	};
};
export type IUserDocument = IUser & mongoose.Document;

const UserSchema = new mongoose.Schema<IUserDocument>({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
	password: { type: String, required: true, minlength: 6 },
	image: { type: String, required: true },
	name: {
		first: { type: String, required: true },
		last: { type: String, required: true },
		middle: { type: String },
	},
});

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
