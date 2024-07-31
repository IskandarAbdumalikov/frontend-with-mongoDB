import express from "express";
import { Users } from "../schema/userScheme.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let users = await Users.find();
    if (!users.length) {
      return res
        .status(400)
        .json({ msg: "Users not found", variant: "warning", payload: null });
    }
    res.status(200).json({
      msg: "All users found",
      variant: "success",
      payload: users,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await Users.findById(req.params.id);
    res.status(200).json({
      msg: "user found",
      variant: "success",
      payload: user,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.post("/", async (req, res) => {
  try {
    let user = await Users.create(req.body);
    res.status(200).json({
      msg: "user created",
      variant: "success",
      payload: user,
    });
  } catch {
    res
      .status(500)
      .json({ msg: "Server error", variant: "error", payload: null });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let user = await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({
      msg: "user deleted",
      variant: "success",
      payload: user,
    });
  } catch {
    res.status(400).json({
      msg: "user not found",
      variant: "error",
      payload: null,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let user = await Users.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      msg: "user updated",
      variant: "success",
      payload: user,
    });
  } catch {
    res.status(400).json({
      msg: "user not found",
      variant: "error",
      payload: null,
    });
  }
});

export default router;
