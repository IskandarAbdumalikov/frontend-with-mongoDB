import express from "express";
import cors from "cors";
import Blog from "./routes/blog.js";
import Comment from "./routes/comment.js";
import User from "./routes/user.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error", err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Endpoints

app.use("/blogs", Blog);
app.use("/comments", Comment);
app.use("/users", User);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
