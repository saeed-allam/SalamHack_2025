import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  summaryId: mongoose.Schema.Types.ObjectId,
  messages: [
    {
      role: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});
export default mongoose.models.chatModel || mongoose.model("chatModel", schema);
