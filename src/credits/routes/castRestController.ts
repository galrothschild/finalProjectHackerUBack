import { Router } from "express";
import {
	getCastMember,
	getCreditsByCastMemberId,
	loadCastMemberCredits,
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
		return res.status(200).send(castMember);
	} catch (error) {
		return next(error);
	}
});

router.get("/:id/credits", async (req, res, next) => {
	try {
		if (!req.params.id || Number.isNaN(+req.params.id) || +req.params.id < 1) {
			return res.status(400).send("Invalid cast member id");
		}
		const castMember = await getCastMember(req.params.id);
		if (!castMember) {
			return res.status(404).send("Cast member not found");
		}
		await loadCastMemberCredits(req.params.id);
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
