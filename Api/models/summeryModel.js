// summery is the Main functionality of the program
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  contentId: String,
  summeryText: String,
  comments: String,
});
export default mongoose.models.summeryModel ||
  mongoose.model("summeryModel", schema);
