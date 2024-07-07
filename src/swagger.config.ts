import swaggerJSDoc from "swagger-jsdoc";
import type { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
export const options: swaggerJSDoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Student Management System",
			version: "1.0.0",
			description:
				"Student Management System covered Create, Read, Update, and Delete operations using a Node.js API",
		},
		servers: [{ url: "http://localhost:3000/" }],
	},

	apis: [
		"./src/movies/routes/moviesRestController.ts",
		"./src/tv/routes/TvRestController.ts",
		"./src/users/routes/usersRestController.ts",
	],
};
const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: Express, port: number) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.get("docs.json", (_req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
	console.log(`Docs available at http://localhost:${port}/api-docs`);
};
