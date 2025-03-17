// content is the list of data that will be scrabed
// displayed after the user connect the app
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  description: String,
  contentId: String,
  title: String,
  image: String,
  url: { type: String, unique: true },
  uploadedAt: Date,
});
export default mongoose.models.contentModel ||
  mongoose.model("contentModel", schema);
