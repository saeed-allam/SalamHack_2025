import chatModel from "../models/chatModel.js";
import summeryModel from "../models/summeryModel.js";

export async function getChatHistory(req, res) {
  const { contentId } = req.params;
  const userId = req.user.id;
  try {
    const chat = await chatModel.findOne({
      summaryId: contentId,
      userId: userId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat history not found" });
    }
    res.json(chat.messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
}

export async function sendMessage(req, res) {
  const { contentId } = req.params;
  const userId = req.user.id;
  const msg = req.body.chat;

  if (!msg || typeof msg !== "string" || msg.trim().length === 0) {
    return res.status(400).json({ message: "Invalid message" });
  }

  try {
    // Find or create chat history
    let chatHistory = await chatModel.findOne({
      summaryId: contentId,
      userId: userId,
    });

    if (!chatHistory) {
      chatHistory = new chatModel({
        userId: userId,
        summaryId: contentId,
        messages: [],
      });
      console.log("No history found. Created new one");
    }

    // Fetch the summary
    const summary = await summeryModel.findOne({
      userId: userId,
      contentId: contentId,
    });

    if (!summary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    const cleanSummary = {
      summeryText: summary.summeryText,
      comments: summary.comments,
    };

    // Add user message to chat history
    chatHistory.messages.push({ role: "user", parts: [{ text: msg }] });

    // Construct the prompt with previous chat history
    const promptText = `${msg} \n\nBased on this summary: ${
      cleanSummary.summeryText
    }\nComments: ${
      cleanSummary.comments
    }\nPrevious conversation: ${chatHistory.messages
      .map((m) => `${m.role}: ${m.parts[0].text}`)
      .join("\n")}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.Gemini}`;

    const data = {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
    };

    // Send to AI API
    const aiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const jdata = await aiResponse.json();
    const aiMessage = jdata?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiMessage) {
      return res
        .status(500)
        .json({ message: "Failed to get a response from AI" });
    }

    // Save AI response to history
    chatHistory.messages.push({
      role: "model",
      parts: [{ text: aiMessage }],
    });

    // Save the updated chat history
    await chatHistory.save();

    return res.status(200).json({
      message: "Message sent successfully",
      answer: aiMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).send("Error processing message");
  }
}
