import { google } from "googleapis";

export async function isGoogleAuthenticated(req, res, next) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const refreshToken = req.cookies?.refresh_token;
  // const refreshToken = req.headers?.cookie;
  if (!refreshToken) {
    return res.status(401).json({ error: "Google Refresh token missing" });
  }

  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();

    console.log("New access token generated:", credentials.access_token);

    req.user = { ...req.user, accessToken: credentials.access_token };

    next();
  } catch (refreshError) {
    console.error("Refresh token expired:", refreshError);
    return res.status(401).json({
      error: "Refresh token expired. Please log in again.",
    });
  }
}
