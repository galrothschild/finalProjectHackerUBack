import { Router } from "express";
import {
	getCastMember,
	getCreditsByCastMemberId,
} from "../data/castDataAccess.service.js";

const router = Router();

router.get("/:id", async (req, res, next) => {
	try {
		if (!req.params.id || Number.isNaN(+req.params.id) || +req.params.id < 1) {
			return res.status(400).send("Invalid cast member id");
		}
		const castMember = await getCastMember(req.params.id);
		if (!castMember) {
			return res.status(404).send("Cast member not found");
		}
		const credits = await getCreditsByCastMemberId(castMember._id);
		if (credits) {
			return res.status(200).send(credits);
		}
		return res.status(404).send("Cast member not found");
	} catch (error) {
		return next(error);
	}
});

// export default router /credits/...
export default router;