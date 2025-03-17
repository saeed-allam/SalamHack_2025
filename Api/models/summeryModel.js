// summery is the Main functionality of the program
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  contentId: mongoose.Schema.Types.ObjectId,
  summeryText: String,
  comments: [
    {
      autherName: String,
      commentText: String,
      likeCount: String,
    },
  ],
});
export default mongoose.models.summeryModel ||
  mongoose.model("summeryModel", schema);
