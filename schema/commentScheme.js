import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  title: String,
});

export const Comments = mongoose.model("comment", commentSchema);
