import { Router } from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import { isGoogleAuthenticated } from "../middleware/isGoogleAuthinticated.js";
import { fetchContent } from "../controllers/contentController.js";

const router = Router();

router.get(
  "/fetchContent",
  authenticateToken,
  isGoogleAuthenticated,
  fetchContent
);

export default router;
