import { Router } from "express";
import { getChatHistory, sendMessage } from "../controllers/chatController.js";
import authenticateToken from "../middleware/isAuthenticated.js";
const router = Router();
router.get("/", authenticateToken, getChatHistory);
router.post("/", authenticateToken, sendMessage);
export default router;
