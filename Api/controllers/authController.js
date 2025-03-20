import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Joi from "joi";
import { google } from "googleapis";

// Joi validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  pw: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  pw: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export async function register(req, res) {
  try {
    // Validate input using Joi
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { pw, email, name } = req.body;
    // Validate input
    if (!pw || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pw, 10);

    // Create the user
    const user = await userModel.create({
      name,
      password: hashedPassword,
      email,
    });

    // Generate a JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Save the token to the user document
    user.jwt = token;
    await user.save();

    console.log("New user created:", user);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email, name: user.name, token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering: " + error });
  }
}

export async function login(req, res) {
  try {
    // Validate input using Joi
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, pw } = req.body;

    // Validate input
    if (!email || !pw) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(pw, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a new JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log(`User loggedIn: ${user} \nlogged in successfully`);
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name, token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while logging in : " + error });
  }
}

export function googleLogin(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
    prompt: "consent",
    state: req.user.id,
  });
  console.log(
    "New google login request: ",
    authUrl,
    " From user: ",
    req.user.id
  );

  res.status(200).json(authUrl);
}

export async function googleCallback(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const userId = req.query.state;
    oauth2Client.setCredentials(tokens);

    const { access_token, refresh_token } = tokens;

    const user = await userModel.findById(userId);
    if (user) {
      user.refreshToken = refresh_token;
      user.refreshTokenExpiry = tokens.expiry_date;
      await user.save();
    } else {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Google login successful.",
      access_token: access_token,
    });
    // res.redirect(`http://localhost:4200/generator/home/${access_token}`);
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Error logging in using google" });
  }
}
