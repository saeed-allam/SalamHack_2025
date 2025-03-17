import { Router } from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import { isGoogleAuthenticated } from "../middleware/isGoogleAuthinticated.js";
import {
  fetchContent,
  fetchComments,
} from "../controllers/contentController.js";

const router = Router();

router.get(
  "/fetchContent",
  authenticateToken,
  isGoogleAuthenticated,
  fetchContent
);
router.post(
  "/fetchComments",
  authenticateToken,
  isGoogleAuthenticated,
  fetchComments
);

export default router;
