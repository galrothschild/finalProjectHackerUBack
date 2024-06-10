import supertest from "supertest";
import app from "../../src/main.js";

describe("users", () => {
	beforeAll(() => {
		process.env.NODE_ENV = "test";
	});
	const request = supertest.agent(app);
	it("should get a list of users from the database", async () => {
		expect(1).toBe(1);
		const res = await request.post("/users/");
		expect(res.status).toEqual(201);
		// expect(res.body).toHaveProperty("users");
		// expect(Array.isArray(res.body.users)).toBe(true);
	});
	// it("Should get 1 user from the database", async () => {
	// 	const res = await request.get("/users/1");
	// 	expect(res).toEqual(
	// 		expect.objectContaining({
	// 			status: 200,
	// 			body: expect.objectContaining({
	// 				id: 1,
	// 				username: "testuser",
	// 			}),
	// 		}),
	// 	);
	// 	expect(res.status).toEqual(200);
	// });
});
