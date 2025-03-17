import { Router } from "express";
const router = Router();
router.get("/:id", getChatHistory);
router.post("/:id", sendMessage);
export default router;
