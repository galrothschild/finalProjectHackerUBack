import { OAuth2Client } from "google-auth-library";

export const oAuth2Client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_CALLBACK_URL,
);
export const authorizeUrl = oAuth2Client.generateAuthUrl({
	access_type: "offline",
	scope: [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	],
});
