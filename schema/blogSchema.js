import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  desc: String,
  url: Array,
  star: Number,
});

export const Blogs = mongoose.model("blog", blogSchema);
