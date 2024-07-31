import express from "express";
import { Comments } from "../schema/commentScheme.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let comments = await Comments.find();
    if (!comments.length) {
      return res
        .status(400)
        .json({ msg: "Comments not found", variant: "warning", payload: null });
    }
    res.status(200).json({
      msg: "All Comments found",
      variant: "success",
      payload: comments,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let comment = await Comments.findById(req.params.id);
    res.status(200).json({
      msg: "Comment found",
      variant: "success",
      payload: comment,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.post("/", async (req, res) => {
  try {
    let comment = await Comments.create(req.body);
    res.status(200).json({
      msg: "Comment created",
      variant: "success",
      payload: comment,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let comment = await Comments.findByIdAndDelete(req.params.id);
    res.status(200).json({
      msg: "Comment deleted",
      variant: "success",
      payload: comment,
    });
  } catch {
    res.status(400).json({
      msg: "Comment not found",
      variant: "error",
      payload: null,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let comment = await Comments.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      msg: "Comment updated",
      variant: "success",
      payload: comment,
    });
  } catch {
    res.status(400).json({
      msg: "Comment not found",
      variant: "error",
      payload: null,
    });
  }
});

export default router;
