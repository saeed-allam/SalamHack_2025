import { GoogleGenerativeAI } from "@google/generative-ai";
import contentModel from "../models/contentModel";
import summeryModel from "../models/summeryModel";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function createSummery(req, res) {
  const { contentId } = req.param;
  const userId = req.user.id;

  const content = await contentModel.findById(contentId);
  if (!content) {
    return res.status(404).json({ message: "Content not found" });
  }

  const summery = await summeryModel.findOne({
    contentId: contentId,
    userId: userId,
  });
  if (summery) {
    return res.json(summery.summeryText);
  }

  try {
    // use YT api to get the comments of this content using its id
    const { summery } = await fetchComments(contentId, req.user.accessToken); // Pass the id to fetchComments

    if (!commentsData.comments || commentsData.comments.length === 0) {
      return res
        .status(400)
        .json({ message: "No comments found for this content" });
    }
    const commentsText = commentsData.comments
      .map((comment) => comment.commentText)
      .join("\n"); // Combine comment texts

    const prompt = `Summarize all these comments and see if people like or hate the video. What do they recommend and how can I improve my videos based on the comments. Answer in 500 words or more if needed. \n\nComments:\n${commentsText}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates[0].content.parts[0].text;

    const newSummery = new summeryModel({
      userId: userId,
      contentId: contentId,
      summeryText: responseText,
      comments: commentsData.comments,
    });
    await newSummery.save();

    res.json(responseText);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to generate summary" });
  }
}

async function fetchComments(contentId, auth) {
  try {
    let nextPageToken = null;
    let allComments = [];

    do {
      const commentsRes = await youtube.commentThreads.list({
        part: "snippet",
        videoId: contentId,
        maxResults: 100,
        pageToken: nextPageToken,
        auth,
      });

      commentsRes.data.items.forEach((item) => {
        allComments.push({
          autherName: item.snippet.topLevelComment.snippet.authorDisplayName,
          commentText: item.snippet.topLevelComment.snippet.textDisplay,
          likeCount: item.snippet.topLevelComment.snippet.likeCount,
        });
      });

      nextPageToken = commentsRes.data.nextPageToken;
    } while (nextPageToken && allComments.length < 100); // stop when 100 comments are fetched or no more pages

    return {
      contentId: contentId,
      comments: allComments,
    };
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
}
