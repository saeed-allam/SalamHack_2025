import { Router } from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  register,
  login,
  googleLogin,
  googleCallback,
  saveGoogleTokens,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/googleLogin", googleLogin);
router.get("/googleCallback", googleCallback);
router.post("/saveGoogleToken", saveGoogleTokens);

export default router;
