import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  summaryId: String,
  messages: [
    {
      role: String,
      parts: [{ text: String }],
      timestamp: { type: Date, default: Date.now },
    },
  ],
});
export default mongoose.models.chatModel || mongoose.model("chatModel", schema);
