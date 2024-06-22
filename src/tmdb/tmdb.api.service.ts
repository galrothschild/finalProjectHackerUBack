const API_URL = process.env.TMDB_API_URL || "https://api.themoviedb.org/3";

const bearer = `Bearer ${process.env.API_READ_TOKEN}`;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getMoviesFromTMDB = async (page: number): Promise<any> => {
	try {
		const response = await fetch(`${API_URL}/movie/popular?&page=${page}`, {
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
