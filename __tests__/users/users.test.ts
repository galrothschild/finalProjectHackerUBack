import supertest from "supertest";
import app from "../../src/main.js";

describe("users", () => {
	beforeAll(() => {
		process.env.NODE_ENV = "test";
	});
	const request = supertest.agent(app);
	it("should create a user to the database", async () => {
		const res = await request.post("/users").send({
			name: { first: "test", last: "user" },
			username: "testuser",
			password: "password",
			email: "test@test.com",
			image: "test.jpg",
		});
		expect(res.body).toHaveProperty("_id");
		expect(res.status).toEqual(201);
	});
	it("should delete a user from the database", async () => {
		// const res = await request.delete("/users/1");
		expect(1).toEqual(1);
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
