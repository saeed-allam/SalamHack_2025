import { google } from "googleapis";
import userModel from "../models/userModel.js";

export async function isGoogleAuthenticated(req, res, next) {
  let accessToken = req.headers.googletoken;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token missing" });
  }

  const oauth2 = google.oauth2({ version: "v2" });
  console.log("Checking google Tokens");
  try {
    const tokenInfo = await oauth2.tokeninfo({ access_token: accessToken });
    req.user = { ...req.user, accessToken: accessToken };
    return next();
  } catch (validationError) {
    try {
      const userId = req.user.id;
      const user = await userModel.findById(userId);

      if (!user || !user.refreshToken || !user.refreshTokenExpiry) {
        return res.status(401).json({ error: "Refresh token not found" });
      }

      if (Date.now() > user.refreshTokenExpiry) {
        return res.status(401).json({ error: "Refresh token expired" });
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI
      );
      oauth2Client.setCredentials({ refresh_token: user.refreshToken });

      const { credentials } = await oauth2Client.refreshAccessToken();

      await userModel.findByIdAndUpdate(userId, {
        refreshTokenExpiry: credentials.expiry_date,
      });

      res.setHeader("newAccessToken", credentials.access_token);

      req.user = { ...req.user, accessToken: credentials.access_token };

      next();
    } catch (refreshError) {
      console.error("Refresh token error:", refreshError);
      return res.status(401).json({ error: "Authentication failed" });
    }
  }
}

// const refreshToken = req.headers.refreshToken;

// if (!refreshToken) {
//   return res.status(401).json({ error: "Google Refresh token missing" });
// }

// try {
//   oauth2Client.setCredentials({ refresh_token: refreshToken });

//   const { credentials } = await oauth2Client.refreshAccessToken();

//   console.log("New access token generated:", credentials.access_token);

//   req.user = { ...req.user, accessToken: credentials.access_token };

//   next();
// } catch (refreshError) {
//   console.error("Refresh token expired:", refreshError);
//   return res.status(401).json({
//     error: "Refresh token expired. Please log in again.",
//   });
// }
