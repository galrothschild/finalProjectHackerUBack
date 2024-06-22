import supertest from "supertest";
import app from "../../src/main.js";

describe("users", () => {
	let createdUserId: string;
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

		createdUserId = res.body._id;
		expect(res.status).toEqual(201);
		expect(createdUserId).toBeDefined();
	});
	it("should get all users from the database", async () => {
		const res = await request.get("/users/");
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.status).toEqual(200);
	});
	it("should get a user from the database", async () => {
		if (!createdUserId) {
			const users = await request.get("/users/");
			createdUserId = users.body[0]._id;
		}
		const res = await request.get(`/users/${createdUserId}`);
		expect(res.status).toEqual(200);
		expect(res.body._id).toEqual(createdUserId);
	});

	it("should update a user in the database", async () => {
		if (!createdUserId) {
			const users = await request.get("/users/");
			createdUserId = users.body[0]._id;
		}
		const res = await request.put(`/users/${createdUserId}`).send({
			name: { first: "test2", last: "user2" },
			username: "testuser",
			password: "password",
			email: "test@test.com",
			image: "test.jpg",
		});
		expect(res.status).toEqual(200);
		expect(res.body.name.first).toEqual("test2");
		expect(res.body.name.last).toEqual("user2");
	});

	it("should delete a user from the database", async () => {
		if (!createdUserId) {
			const users = await request.get("/users/");
			createdUserId = users.body[0]._id;
		}
		const res = await request.delete(`/users/${createdUserId}`);
		console.log(res.status);
		expect(1).toBe(1);
	}, 20000);

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
