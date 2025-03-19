import { Router } from "express";
import { getChatHistory, sendMessage } from "../controllers/chatController.js";
import authenticateToken from "../middleware/isAuthenticated.js";
const router = Router();
router.get("/:contentId", authenticateToken, getChatHistory);
router.post("/:contentId", authenticateToken, sendMessage);
export default router;
