import mongoose from "mongoose";
import type {
	Genre,
	ProductionCompany,
} from "../../movies/data/Movie.model.js";
import { CastSchema, type ICastMember } from "../../credits/data/Cast.model.js";
export interface ITVShow {
	backdrop_path: string;
	first_air_date: string;
	genres: Genre[];
	id: number;
	in_production: boolean;
	last_air_date: string;
	last_episode_to_air: LastEpisodeToAir;
	name: string;
	next_episode_to_air: Episode | null;
	networks: Network[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	seasons: Season[];
	status: string;
	tagline: string;
	type: string;
	cast: ICastMember[];
}
export type ITVShowDocument = ITVShow & mongoose.Document;

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

const LastEpisodeToAirSchema = new mongoose.Schema<LastEpisodeToAir>({
	id: { type: Number, required: true },
	name: { type: String, required: true },
	overview: { type: String },
	vote_average: { type: Number },
	vote_count: { type: Number },
	air_date: { type: String },
	episode_number: { type: Number },
	episode_type: { type: String },
	production_code: { type: String },
	runtime: { type: Number },
	season_number: { type: Number },
	show_id: { type: Number },
	still_path: { type: String, required: false },
});

const NetworkSchema = new mongoose.Schema<Network>({
	id: { type: Number, required: true },
	logo_path: { type: String },
	name: { type: String, required: true },
	origin_country: { type: String },
});

const SeasonSchema = new mongoose.Schema<Season>({
	air_date: { type: String, required: false },
	episode_count: { type: Number, required: true },
	id: { type: Number, required: true },
	name: { type: String, required: true },
	overview: { type: String },
	poster_path: { type: String, required: false },
	season_number: { type: Number },
	vote_average: { type: Number },
});

const EpisodeSchema = new mongoose.Schema<Episode>({
	id: { type: Number, required: true },
	name: { type: String, required: true },
	overview: { type: String },
	vote_average: { type: Number },
	vote_count: { type: Number },
	air_date: { type: String },
	episode_number: { type: Number },
	episode_type: { type: String },
	production_code: { type: String },
	season_number: { type: Number },
	show_id: { type: Number },
});

export const EpisodeModel = mongoose.model<Episode>("Episode", EpisodeSchema);

const TVShowSchema = new mongoose.Schema({
	name: { type: String, required: true },
	backdrop_path: { type: String, required: false },
	first_air_date: { type: String },
	genres: { type: [GenreSchema] },
	id: { type: Number, required: true },
	in_production: { type: Boolean },
	last_air_date: { type: String },
	last_episode_to_air: { type: LastEpisodeToAirSchema },
	next_episode_to_air: { type: EpisodeSchema },
	networks: { type: [NetworkSchema] },
	number_of_episodes: { type: Number },
	number_of_seasons: { type: Number },
	origin_country: { type: [String] },
	original_name: { type: String },
	overview: { type: String, required: false },
	popularity: { type: Number },
	poster_path: { type: String },
	production_companies: { type: [ProductionCompanySchema] },
	seasons: { type: [SeasonSchema], required: true },
	status: { type: String },
	tagline: { type: String },
	type: { type: String },
	cast: { type: [CastSchema] },
});

export const TVShowModel = mongoose.model<ITVShowDocument>(
	"tvshow",
	TVShowSchema,
);
