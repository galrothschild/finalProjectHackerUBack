import type { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import logger from "./utils/logger/logger.js";

const PORT = process.env.PORT || 3000;

const swaggerDocument = JSON.parse(fs.readFileSync("src/swagger.json", "utf8"));

swaggerDocument.servers[0].url = `http://localhost:${PORT}`;

export const swaggerDocs = (app: Express, port: number) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	app.get("docs.json", (_req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerDocument);
	});
	logger.info(`Docs available at http://localhost:${port}/api-docs`);
};
