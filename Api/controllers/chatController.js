import { GoogleGenerativeAI } from "@google/generative-ai";
import chatModel from "../models/chatModel.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getChatHistory(req, res) {
  const summaryId = req.params.summaryId;
  try {
    const chat = await chatModel.findById(summaryId);
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
  const userID = req.user.id;
  const summaryId = req.params.summaryId;
  const msg = req.body.chat;
  let promptString = "";

  try {
    let chatDoc = await chatModel.findById(summaryId);

    if (!chatDoc) {
      chatDoc = new chatModel({
        userId: userID,
        summaryId: summaryId,
        messages: [],
      });
    }

    // Add user message to history and save
    chatDoc.messages.push({ role: "user", content: msg });
    await chatDoc.save();

    const chat = model.startChat({
      history: chatDoc.messages,
    });

    const result = await chat.sendMessageStream(msg);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      promptString += chunkText + " ";
      res.write(chunkText);
    }

    chatDoc.messages.push({ role: "ai", content: promptString });
    await chatDoc.save();

    res.end();
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error processing message");
  }
}
