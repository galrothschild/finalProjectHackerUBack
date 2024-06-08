import supertest from "supertest";
import app from "../src/main.js";

describe("main", () => {
	const request = supertest.agent(app);
	it("should get Hello World", async () => {
		const res = await request.get("/movies/");
		expect(res.text).toEqual("Hello World!");
		expect(res.status).toEqual(200);
	});
});
