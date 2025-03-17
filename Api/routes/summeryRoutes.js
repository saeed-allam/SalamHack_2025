import { Router } from "express";
const router = Router();

router.get("/:id", getSummary);
export default router;
