import contentModel from "../models/contentModel.js";
import summeryModel from "../models/summeryModel.js";
import userModel from "../models/userModel.js";
import { google } from "googleapis";

const youtube = google.youtube({ version: "v3" });

export async function fetchContent(req, res) {
  const userId = req.user.id;

  try {
    // Fetch user from DB
    const user = await userModel.findById(userId);
    console.log("/FetchContent");

    if (!user) return res.status(404).json({ message: "User not found" });

    // check if the info is in the db already
    const content = await contentModel.find({ userId });
    if (content) {
      return res.status(200).json(content);
    }

    const auth = req.user.accessToken; // OAuth token from the request

    // Get user's channel ID
    const channelRes = await youtube.channels.list({
      mine: true,
      part: "contentDetails",
      auth,
    });

    if (!channelRes.data.items.length) {
      return res.status(400).json({ message: "No channel found" });
    }

    const uploadsPlaylistId =
      channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

    let nextPageToken = null;
    let videos = [];

    do {
      const playlistRes = await youtube.playlistItems.list({
        playlistId: uploadsPlaylistId,
        part: "snippet",
        maxResults: 50,
        pageToken: nextPageToken,
        auth,
      });

      playlistRes.data.items.forEach((item) => {
        videos.push({
          userId,
          contentId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          image: item.snippet.thumbnails.medium.url,
          url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
          uploadedAt: item.snippet.publishedAt,
        });
      });

      nextPageToken = playlistRes.data.nextPageToken;
    } while (nextPageToken);

    // Store videos in DB
    await contentModel.insertMany(videos, { ordered: false }).catch(() => {});

    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch content" });
  }
}

export async function fetchComments(req, res) {
  const userId = req.user.id;
  const { videoUrl } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const videoId = new URL(videoUrl).searchParams.get("v");
    if (!videoId) return res.status(400).json({ message: "Invalid video URL" });

    const auth = req.user.accessToken;

    const commentsRes = await youtube.commentThreads.list({
      videoId,
      part: "snippet",
      maxResults: 100,
      auth,
    });

    const comments = commentsRes.data.items.map((item) => ({
      authorName: item.snippet.topLevelComment.snippet.authorDisplayName,
      commentText: item.snippet.topLevelComment.snippet.textDisplay,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
    }));

    await summeryModel.create({ userId, contentId: videoId, comments });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
}

// function extractChannelId(link) {
//   const match = link.match(/(?:channel\/|user\/|c\/|@)([a-zA-Z0-9_-]+)/);
//   return match ? match[1] : null;
// }

// function verifyLink(link) {
//   if (!link) return false;

//   try {
//     const url = new URL(link);
//     if (url.protocol !== "https:" || url.host !== "www.youtube.com") {
//       return false;
//     }

//     const regex =
//       /^https:\/\/www\.youtube\.com\/(?:channel\/|user\/|c\/|@)[a-zA-Z0-9_-]+$/;
//     if (!regex.test(link)) {
//       return false;
//     }

//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// change to add link manually
// export async function connectApp(req, res) {
//   const { channelLink } = req.body;
//   const id = req.user.id;

//   if (!id || !channelLink) {
//     return res.status(400).json({ message: "Invalid request" });
//   }

//   const linkOk = verifyLink(channelLink);
//   if (!linkOk) {
//     return res.status(400).json({ message: "Invalid link" });
//   }

//   try {
//     const user = await userModel.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const channelId = extractChannelId(channelLink);
//     if (!channelId)
//       return res.status(400).json({ message: "Invalid channel link" });

//     // Check for duplicate channel connections
//     if (user.channelId === channelId) {
//       return res.status(400).json({ message: "Channel already connected" });
//     }

//     await userModel.findByIdAndUpdate(id, { channelId });

//     console.log(user.name + " Channel connected successfully :" + channelId);
//     res
//       .status(200)
//       .json({ message: "Channel connected successfully", channelId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to connect channel" });
//   }
// }
