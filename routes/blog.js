import express from "express";
import { Blogs } from "../schema/blogSchema.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let blogs = await Blogs.find();
    if (!blogs.length) {
      return res
        .status(400)
        .json({ msg: "Blogs not found", variant: "warning", payload: null });
    }
    res.status(200).json({
      msg: "All blogs found",
      variant: "success",
      payload: blogs,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let blog = await Blogs.findById(req.params.id);
    res.status(200).json({
      msg: "Blog found",
      variant: "success",
      payload: blog,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.post("/", async (req, res) => {
  try {
    let blog = await Blogs.create(req.body);
    res.status(200).json({
      msg: "Blog created",
      variant: "success",
      payload: blog,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let blog = await Blogs.findByIdAndDelete(req.params.id);
    res.status(200).json({
      msg: "Blog deleted",
      variant: "success",
      payload: blog,
    });
  } catch {
    res.status(400).json({
      msg: "Blog not found",
      variant: "error",
      payload: null,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let blog = await Blogs.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      msg: "Blog updated",
      variant: "success",
      payload: blog,
    });
  } catch {
    res.status(400).json({
      msg: "Blog not found",
      variant: "error",
      payload: null,
    });
  }
});

export default router;
