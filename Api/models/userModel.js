import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleAccessToken: String,
});

export default mongoose.models.userModel || mongoose.model("userModel", schema);
