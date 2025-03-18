import { Router } from "express";
import createSummery from "../controllers/summeryController.js";
const router = Router();

router.post("/:contentId", createSummery);
export default router;
