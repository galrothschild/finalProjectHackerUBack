import supertest from "supertest";
import app from "../src/main.js";
describe("main", () => {
	beforeAll(() => {
		process.env.NODE_ENV = "test";
	});
	const request = supertest.agent(app);

	it("should get a list of movies from TMDB page 1", async () => {
		const res = await request.get("/movies/");
		expect(res.status).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
	it("should get a list of movies from TMDB page 3", async () => {
		const res = await request.get("/movies/").send({ page: 3 });
		expect(res.status).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
	it("Should get 1 movie from TMDB", async () => {
		const res = await request.get("/movies/13");
		expect(res).toEqual(
			expect.objectContaining({
				status: 200,
				body: expect.objectContaining({
					id: 13,
					title: "Forrest Gump",
				}),
			}),
		);
		expect(res.status).toEqual(200);
	});
});
