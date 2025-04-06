import express from "express";
import { getCourseRecommendations } from "../controllers/recommendation.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/recommendations", isAuth, getCourseRecommendations);

export default router;
