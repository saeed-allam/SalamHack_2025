import { Router } from "express";
import isAuth from "../middleware/isAuthenticated.js";
import { isGoogleAuthenticated } from "../middleware/isGoogleAuthinticated.js";
import createSummery from "../controllers/summeryController.js";
const router = Router();

router.get("/:contentId", isAuth, isGoogleAuthenticated, createSummery);
export default router;
