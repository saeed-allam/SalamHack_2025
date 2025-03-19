import { GoogleGenerativeAI } from "@google/generative-ai";
import contentListModel from "../models/contentModel.js";
import summeryModel from "../models/summeryModel.js";
const genAI = new GoogleGenerativeAI(process.env.Gemini);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export default async function createSummery(req, res) {
  const { contentId } = req.params;

  const userId = req.user.id;

  //check if the video exists in the db
  const contentFound = await checkContent(userId, contentId, res);
  if (!contentFound) res.status(404).json({ message: "Content not found" });

  // check if there was a summery created in the db
  const summery = await summeryModel.findOne({
    contentId: contentId,
    userId: userId,
  });

  if (summery) {
    console.log("Got the summery from the db");
    return res.json(summery.summeryText);
  }

  try {
    const commentsData = await fetchComments(contentId, req.user.accessToken);

    if (
      !commentsData ||
      !Array.isArray(commentsData) ||
      commentsData.length === 0 ||
      !commentsData.every(
        (comment) =>
          typeof comment.textDisplay === "string" &&
          typeof comment.likeCount === "number"
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid or empty comments data. Cannot create a summary from this content.",
      });
    }
    const commentsText = commentsData.map(formatComment).join("\n\n");

    const prompt = `
Analyze the following cross-platform reviews and comments with a focus on delivering actionable insights, quantitative analysis, and strategic recommendations. Your analysis should be at least 500 words and include specific numerical data and percentages where applicable.

**Objective:** To provide a comprehensive understanding of user sentiment, identify key trends, and generate data-driven strategies for product improvement, content optimization, and ad performance enhancement.

**Data Source:** Aggregated reviews and comments YouTube

**Analysis Parameters:**

1.  **Sentiment Breakdown:** Quantify the overall sentiment across all platforms. Calculate the percentage of positive, negative, and neutral comments. Provide confidence scores for each sentiment category.
2.  **Trend Identification:** Identify recurring themes and patterns in the feedback. Highlight specific keywords and phrases that are frequently mentioned.
3.  **Performance Metrics:** Analyze engagement metrics such as like counts, share counts, and comment volume. Correlate these metrics with sentiment to understand the impact of positive and negative feedback.
4.  **Actionable Recommendations:** Generate a list of concrete, data-backed recommendations for product improvement, content strategy adjustments, and ad campaign optimization.
5.  **Competitive Benchmarking:** If possible, compare sentiment and performance metrics against competitors to identify areas for differentiation.
6.  **Keyword Analysis:** Generate a word map and keyword analysis to reveal high-impact phrases and associated terms.

**Specific Prompts:**

* "Based on the analysis, what percentage of users express positive sentiment towards [Product/Content/Ad]? What are the top three positive themes mentioned?"
* "Identify the most common negative feedback themes. What is the frequency of these complaints, and what percentage of users are affected?"
* "Analyze the correlation between comment sentiment and engagement metrics. Which videos/products/ads generate the most positive engagement, and why?"
* "Provide specific recommendations for improving [Product/Content/Ad] based on the identified negative feedback themes. Include measurable goals and expected outcomes."
* "Generate a keyword map highlighting the most frequently mentioned terms. How can these keywords be leveraged for SEO and content optimization?"
* "Compare the sentiment and performance metrics of [Your Brand] with [Competitor Brand]. What are the key areas for improvement?"
* "How does the sentiment change over time? Are there any specific events or campaigns that correlate with shifts in sentiment?"
* "Analyze the comments related to ad campaigns. What percentage of users express positive sentiment towards the ads? What are the key takeaways for ad optimization?"
* "Provide a numerical breakdown of the average like count, comment count, and share count. How do these metrics vary across different platforms?"
* "Based on the data, what are the top 3 recommendations for product improvement and the top 3 recommendations for content strategy adjustment. Provide specific metrics that will be used to measure the success of these changes"
* "Using the comment data, create a customer profile. What are the common characteristics, needs, and preferences of your target audience?"

**Expected Output:**

* A detailed report summarizing the sentiment analysis, trend identification, performance metrics, and actionable recommendations.
* Interactive visual dashboards with graphs, charts, and word maps.
* A list of high-impact keywords and associated terms.
* A competitive benchmarking analysis (if applicable).
* A clear articulation of the business value proposition, including measurable outcomes and ROI.
* A customer profile based on the comment data.

**Example Numerical Data:**

* "85% of users express positive sentiment towards the product, with a confidence score of 92%."
* "25% of users report issues with battery life, with an average of 3 complaints per 100 reviews."
* "Videos with behind-the-scenes content generate 30% more engagement compared to standard product reviews."
* "Ad campaign A generated a 75% positive sentiment, while Ad campaign B generated a 40% positive sentiment."
* "The average like count is 500, the average comment count is 150, and the average share count is 75."

This prompt is designed to elicit a comprehensive and data-driven analysis of cross-platform reviews and comments, empowering businesses and content creators to make informed decisions and achieve measurable results.

 \n\nComments:\n${commentsText}`;

    const result = await model.generateContent(prompt);
    // Verify the response
    if (
      !result ||
      !result.response ||
      !result.response.candidates ||
      result.response.candidates.length === 0 ||
      !result.response.candidates[0].content ||
      !result.response.candidates[0].content.parts ||
      result.response.candidates[0].content.parts.length === 0 ||
      !result.response.candidates[0].content.parts[0].text
    ) {
      return res.status(500).json({
        message: "Failed to generate summary: Invalid Gemini response",
      });
    }
    const responseText = result.response.candidates[0].content.parts[0].text;

    const newSummery = new summeryModel({
      userId: userId,
      contentId: contentId,
      summeryText: responseText,
      comments: commentsText,
    });
    await newSummery.save();

    res.status(200).json(responseText);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate summary" });
  }
}

async function checkContent(userId, contentId, res) {
  try {
    const content = await getContentIds(userId);

    if (!content || content.length === 0) {
      return res.status(404).json({ message: "Content not found" });
    }

    const contentIdInList = content.find((id) => id === contentId);

    if (!contentIdInList) {
      return res.status(404).json({ message: "Content not found" });
    }

    // If the content exists, you can continue with your logic here.
    return true;
  } catch (error) {
    console.error("Error checking content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function getContentIds(userId) {
  try {
    const contentList = await contentListModel.findOne({ userId: userId });

    if (contentList && contentList.uploadsPlaylist) {
      const contentIds = contentList.uploadsPlaylist.map(
        (item) => item.contentId
      );
      return contentIds;
    } else {
      return []; // Return an empty array if no content list or playlist found
    }
  } catch (error) {
    console.error("Error fetching content IDs:", error);
    return []; // Return an empty array in case of an error
  }
}

async function fetchComments(contentId, accessToken) {
  try {
    const response = await fetch(
      `
      https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${contentId}&maxResults=100&order=relevance&key=${process.env.YT_API_KEY}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    return extractCommentData(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return null;
  }
}

function extractCommentData(commentThreadResponse) {
  const extractedData = [];

  commentThreadResponse.items.forEach((commentThread) => {
    const topLevelComment = commentThread.snippet.topLevelComment.snippet;
    const commentData = {
      textDisplay: topLevelComment.textDisplay,
      likeCount: topLevelComment.likeCount,
    };

    if (commentThread.replies) {
      commentThread.replies.comments.forEach((reply) => {
        const replyData = {
          textDisplay: reply.snippet.textDisplay,
          likeCount: reply.snippet.likeCount,
        };
        commentData.replies = commentData.replies || [];
        commentData.replies.push(replyData);
      });
    }

    extractedData.push(commentData);
  });

  return extractedData;
}

const formatComment = (comment, indent = 0) => {
  const indentation = "  ".repeat(indent);
  let result = `${indentation}➤ Comment: "${comment.textDisplay}" (Likes: ${comment.likeCount})`;

  if (comment.replies && comment.replies.length > 0) {
    result += `\n${indentation}  Replies:\n${comment.replies
      .map((reply) => formatComment(reply, indent + 2))
      .join("\n")}`;
  }

  return result;
};
