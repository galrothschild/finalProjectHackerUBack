const API_URL = process.env.TMDB_API_URL || "https://api.themoviedb.org/3";

const bearer = `Bearer ${process.env.API_READ_TOKEN}`;
export const getMoviesFromTMDB = async (
	page: number,
	query?: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> => {
	const URL = query
		? `/search/movie?&query=${query}&page=${page}`
		: `/movie/popular?&page=${page}`;
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
