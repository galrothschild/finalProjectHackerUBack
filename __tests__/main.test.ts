import supertest from "supertest";
import app from "../src/main.js";
describe("movies", () => {
	beforeAll(() => {
		process.env.NODE_ENV = "test";
	});
	afterAll(async () => {
		await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
	});
	const request = supertest.agent(app);

	it("should get a list of movies from TMDB page 1", async () => {
		const res = await request.get("/movies/");
		expect(res.status).toEqual(200);
		expect(Array.isArray(res.body.results)).toBe(true);
	});
	it("should get a list of movies from TMDB page 3", async () => {
		const res = await request.get("/movies/?page=3");
		expect(res.status).toEqual(200);
		expect(Array.isArray(res.body.results)).toBe(true);
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
	it("Should return 404 for a movie that does not exist", async () => {
		const res = await request.get("/movies/999999999");
		expect(res.status).toEqual(404);
	});
	it("Should return 400 for an invalid movie id", async () => {
		const res = await request.get("/movies/invalid");
		expect(res.status).toEqual(400);
	});
	it("Should return 400 for an invalid page number", async () => {
		const res = await request.get("/movies/?page=invalid");
		expect(res.status).toEqual(400);
	});
	it("Should return 400 for an invalid page number", async () => {
		const res = await request.get("/movies/?page=-1");
		expect(res.status).toEqual(400);
	});
	it("Should find forrest gump in movies", async () => {
		const res = await request.get("/movies/?query=forrest+gump");
		expect(res.status).toEqual(200);
		expect(res.body.results.length).toBeGreaterThan(0);
		expect(res.body.results[0].title).toEqual("Forrest Gump");
	});
	it("Should return an empty list", async () => {
		const res = await request.get(
			"/movies/?query=askdhgaikjshdm%2Czxnbciaosdh",
		);
		expect(res.status).toEqual(200);
		expect(res.body.results.length).toEqual(0);
	});
});
describe("tv", () => {
	beforeAll(() => {
		process.env.NODE_ENV = "test";
	});
	afterAll(async () => {
		await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
	});
	const request = supertest.agent(app);
	it("Should return tv shows list", async () => {
		const res = await request.get("/tv");
		expect(res.status).toEqual(200);
		expect(Array.isArray(res.body.results)).toBe(true);
	});
	it("Should return tv show details", async () => {
		const res = await request.get("/tv/13");
		expect(res.status).toEqual(200);
		expect(res.body.id).toEqual(13);
	});
	it("Should return 404 for tv show that does not exist", async () => {
		const res = await request.get("/tv/999999999");
		expect(res.status).toEqual(404);
	});
	it("Should return 400 for invalid tv show id", async () => {
		const res = await request.get("/tv/invalid");
		expect(res.status).toEqual(400);
	});
	it("Should return 400 for invalid tv show id", async () => {
		const res = await request.get("/tv/-1");
		expect(res.status).toEqual(400);
	});
	it("Should find breaking bad in tv shows", async () => {
		const res = await request.get("/tv/?query=breaking+bad");
		expect(res.status).toEqual(200);
		expect(res.body.results.length).toBeGreaterThan(0);
		expect(res.body.results[0].name).toEqual("Breaking Bad");
	});
	it("Should return an empty list", async () => {
		const res = await request.get("/tv/?query=yugoijdnkw4erhgfihousd");
		expect(res.status).toEqual(200);
		expect(res.body.results.length).toEqual(0);
	});
});
