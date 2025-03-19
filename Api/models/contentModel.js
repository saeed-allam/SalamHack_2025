import mongoose from "mongoose";

const contentItemSchema = new mongoose.Schema({
  description: String,
  contentId: String,
  title: String,
  image: String,
  uploadedAt: Date,
  publishedAt: Date,
});

const contentListSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  uploadsPlaylist: [contentItemSchema], // Array of content items
});

const contentListModel =
  mongoose.models.contentListModel ||
  mongoose.model("contentListModel", contentListSchema);

export default contentListModel;
