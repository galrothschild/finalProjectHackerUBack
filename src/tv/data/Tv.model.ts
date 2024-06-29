import mongoose from "mongoose";
import type {
	Genre,
	ProductionCompany,
	ProductionCountry,
	SpokenLanguage,
} from "../../movies/data/Movie.model.js";
export interface ITVShow {
	adult: boolean;
	backdrop_path: string;
	created_by: CreatedBy[];
	first_air_date: string;
	genres: Genre[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: LastEpisodeToAir;
	name: string;
	next_episode_to_air: Episode | null;
	networks: Network[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	seasons: Season[];
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
}

export interface Episode {
	id: number;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
	air_date: string;
	episode_number: number;
	episode_type: string;
	production_code: string;
	season_number: number;
	show_id: number;
}

export interface CreatedBy {
	id: number;
	credit_id: string;
	name: string;
	original_name: string;
	gender: number;
	profile_path: string;
}

export interface LastEpisodeToAir {
	id: number;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
	air_date: string;
	episode_number: number;
	episode_type: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string;
}

export interface Network {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
}

export interface Season {
	air_date?: string;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
}

const GenreSchema = new mongoose.Schema<Genre>({
	id: { type: Number, required: true },
	name: { type: String, required: true },
});

const ProductionCompanySchema = new mongoose.Schema<ProductionCompany>({
	id: { type: Number, required: true },
	logo_path: { type: String },
	name: { type: String, required: true },
	origin_country: { type: String, required: false },
});

const ProductionCountrySchema = new mongoose.Schema<ProductionCountry>({
	iso_3166_1: { type: String, required: true },
	name: { type: String, required: true },
});

const SpokenLanguageSchema = new mongoose.Schema<SpokenLanguage>({
	english_name: { type: String, required: true },
	iso_639_1: { type: String, required: true },
	name: { type: String, required: false },
});

const MovieSchema = new mongoose.Schema<IMovieDocument>({
	adult: { type: Boolean, required: true },
	backdrop_path: { type: String, required: false },
	budget: { type: Number, required: true },
	genres: { type: [GenreSchema], required: true },
	homepage: { type: String, required: false },
	id: { type: Number, required: true },
	imdb_id: { type: String, required: false },
	origin_country: { type: [String], required: true },
	original_language: { type: String, required: true },
	original_title: { type: String, required: true },
	overview: { type: String, required: true },
	popularity: { type: Number, required: true },
	poster_path: { type: String, required: false },
	production_companies: { type: [ProductionCompanySchema], required: true },
	production_countries: { type: [ProductionCountrySchema], required: true },
	release_date: {
		type: String,
		required: false,
		default: new Date(0).toString(),
	},
	revenue: { type: Number, required: true },
	runtime: { type: Number, required: true },
	spoken_languages: { type: [SpokenLanguageSchema], required: true },
	status: { type: String, required: true },
	tagline: { type: String, required: false },
	title: { type: String, required: true },
	video: { type: Boolean, required: true },
	vote_average: { type: Number, required: true },
	vote_count: { type: Number, required: true },
});

export const MovieModel = mongoose.model<IMovieDocument>("Movie", MovieSchema);
