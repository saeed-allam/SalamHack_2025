import contentListModel from "../models/contentModel.js";
import userModel from "../models/userModel.js";

export async function fetchContent(req, res) {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    console.log("/FetchContent");

    if (!user) return res.status(404).json({ message: "User not found" });

    const content = await contentListModel.findOne({ userId }); // find one document
    if (content) {
      console.log("already exist in db");
      return res.status(200).json(content.uploadsPlaylist); // return the array of videos.
    }

    const auth = req.user.accessToken;
    const channelDetails = await getChannelDetails(auth);
    if (!channelDetails) {
      return res
        .status(404)
        .json({ message: "Channel not found or the user might not have one" });
    }

    const uploadsPlaylist = await getUploadsVideos(auth, channelDetails.id);
    if (!uploadsPlaylist) {
      return res.status(404).json({ message: "Uploads playlist not found" });
    }
    await userModel.findByIdAndUpdate(userId, {
      youtubeName: channelDetails.title,
      channelId: channelDetails.customUrl,
      customUrl: channelDetails.id,
    });
    const fetchedVideos = await contentListModel.create({
      userId,
      uploadsPlaylist,
    });
    res.status(200).json(fetchedVideos.uploadsPlaylist); // send the array of videos.
  } catch (error) {
    console.error("Error in fetchContent:", error);
    res.status(500).json({ message: "Failed to fetch content" });
  }
}

async function getChannelDetails(auth) {
  try {
    console.log("checking channel details");
    const getChannelDetailsRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    );
    if (!getChannelDetailsRes.ok) {
      throw new Error(`HTTP error! status: ${getChannelDetailsRes.status}`);
    }

    const channelDetails = await getChannelDetailsRes.json();

    if (!channelDetails.items || channelDetails.items.length === 0) {
      return null; // Return null to indicate no channel found
    }

    const {
      items: [{ snippet, id }],
    } = channelDetails;

    const { title, customUrl } = snippet;

    console.log("Got this channel details: ", {
      title,
      customUrl,
      channelId: id,
    });
    return { title, customUrl, id };
  } catch (error) {
    console.error("Error in getChannelDetails:", error);
    return null; // Return null on error
  }
}

async function getUploadsVideos(auth, userId) {
  try {
    const playlistId = "UU" + userId.slice(2);
    const getPlaylistDetailsRes = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${process.env.YT_API_KEY}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    );
    if (!getPlaylistDetailsRes.ok) {
      throw new Error(`HTTP error! status: ${getPlaylistDetailsRes.status}`);
    }
    const playlistDetails = await getPlaylistDetailsRes.json();

    return sortUploadedVideos(playlistDetails);
  } catch (error) {
    console.error("Error in getUploadsVideos:", error);
    return null;
  }
}

function sortUploadedVideos(data) {
  try {
    const relevantData = data.items.map((item) => {
      const snippet = item.snippet;
      const contentDetails = item.contentDetails;
      return {
        publishedAt: snippet.publishedAt,
        title: snippet.title,
        description: snippet.description,
        contentId: contentDetails.videoId,
        image: snippet.thumbnails.high.url,
      };
    });
    return relevantData;
  } catch (error) {
    console.error("Error in sortUploadedVideos:", error);
    return [];
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
