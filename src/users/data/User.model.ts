import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
	isAdmin: boolean;
	watchList: watchListEntry[];
	watched: watchListEntry[];
};
type watchListEntry = {
	type: "tv show" | "movie";
	id: mongoose.Types.ObjectId;
};
export type IUserDocument = IUser & mongoose.Document;

export type loginUserType = {
	username: string;
	password: string;
};
const watchListEntrySchema = new mongoose.Schema({
	type: String,
	id: mongoose.Types.ObjectId,
});

const UserSchema = new mongoose.Schema<IUserDocument>({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
	password: { type: String, required: true, minlength: 6 },
	image: {
		type: String,
		required: true,
		default: "https://via.placeholder.com/150",
		match: /^https?:\/\//,
	},
	name: {
		first: { type: String, required: true },
		last: { type: String, required: true },
		middle: { type: String },
	},
	isAdmin: { type: Boolean, default: false },
	watched: { type: [watchListEntrySchema], default: [] },
	watchList: { type: [watchListEntrySchema], default: [] },
});

const pepper = process.env.PEPPER || "pepper";

// hashing the password before saving a user (if the password is modified)
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	// hash the password
	const hash = await bcrypt.hash(pepper + this.password, 10);
	this.password = hash;
	next();
});

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
