import mongoose from "mongoose";
import type { ICastMember } from "../../credits/data/Cast.model.js";

export interface IMovie {
	adult: boolean;
	backdrop_path: string;
	budget: number;
	genres: Genre[];
	homepage: string;
	id: number;
	imdb_id: string;
	origin_country: string[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	cast: ICastMember[];
}

export interface Genre {
	id: number;
	name: string;
}

export interface ProductionCompany {
	id: number;
	logo_path?: string;
	name: string;
	origin_country?: string;
}

export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}
export type IMovieDocument = IMovie & mongoose.Document;

const GenreSchema = new mongoose.Schema<Genre>({
	id: { type: Number, required: true },
	name: { type: String, required: true },
});

const SpokenLanguageSchema = new mongoose.Schema<SpokenLanguage>({
	english_name: { type: String, required: true },
	iso_639_1: { type: String, required: true },
	name: { type: String, required: false },
});

const MovieSchema = new mongoose.Schema<IMovieDocument>({
	backdrop_path: { type: String, required: false },
	genres: { type: [GenreSchema], required: true },
	homepage: { type: String, required: false },
	id: { type: Number, required: true },
	imdb_id: { type: String, required: false },
	origin_country: { type: [String], required: true },
	original_language: { type: String, required: true },
	original_title: { type: String, required: true },
	overview: { type: String, required: true },
	poster_path: { type: String, required: false },
	release_date: {
		type: String,
		required: false,
		default: new Date(0).toString(),
	},
	spoken_languages: { type: [SpokenLanguageSchema], required: true },
	tagline: { type: String, required: false },
	title: { type: String, required: true },
});

export const MovieModel = mongoose.model<IMovieDocument>("movie", MovieSchema);
