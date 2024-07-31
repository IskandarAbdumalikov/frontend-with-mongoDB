import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  username: String,
  password: String,
  age: Number,
  url: String,
  gender: String,
  isActive: Boolean,
  budget: Number,
});

export const Users = mongoose.model("user", userSchema);
