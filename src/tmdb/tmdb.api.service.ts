const API_URL = process.env.TMDB_API_URL || "https://api.themoviedb.org/3";

const bearer = `Bearer ${process.env.API_READ_TOKEN}`;
export const getFromTMDB = async (
	page: number,
	api: "movie" | "tv",
	query?: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> => {
	const URL = query
		? `/search/${api}?&query=${query}&page=${page}`
		: `/${api}/popular?&page=${page}`;
	try {
		const response = await fetch(`${API_URL}${URL}`, {
			headers: {
				Authorization: bearer,
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};
export const getFilteredFromTMDB = async (
	Genres: string,
	api: "movie" | "tv",
	page?: number,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> => {
	const pageNumber = page || 1;
	try {
		const response = await fetch(
			`${API_URL}/discover/${api}?with_genres=${Genres}&page=${pageNumber}`,
			{
				headers: {
					Authorization: bearer,
					"Content-Type": "application/json",
				},
			},
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error.toString().red);
		return null;
	}
};
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getMovieFromTMDB = async (id: string): Promise<any> => {
	try {
		const response = await fetch(`${API_URL}/movie/${id}`, {
			headers: {
				Authorization: bearer,
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getTVShowsFromTMDB = async (
	page: number,
	query?: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> => {
	const URL = query
		? `/search/tv?&query=${query}&page=${page}`
		: `/tv/popular?&page=${page}`;
	try {
		const response = await fetch(`${API_URL}${URL}`, {
			headers: {
				Authorization: bearer,
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getTVShowFromTMDB = async (id: string): Promise<any> => {
	try {
		const response = await fetch(`${API_URL}/tv/${id}`, {
			headers: {
				Authorization: bearer,
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};
