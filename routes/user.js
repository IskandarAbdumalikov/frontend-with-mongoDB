import express from "express";
import { Users, validationUser } from "../schema/userScheme.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 5, skip = 1, gender } = req.query;
    const limitInt = parseInt(limit);
    const skipInt = (parseInt(skip) - 1) * limitInt;

    let filter = {};
    if (gender && gender != "all") {
      filter.gender = gender;
    }

    let users = await Users.find(filter).limit(limitInt).skip(skipInt);

    if (!users.length) {
      return res.status(400).json({
        msg: "Users not found",
        variant: "warning",
        payload: null,
        total:0
      });
    }
    const total = await Users.countDocuments(filter);
    res.status(200).json({
      msg: "All users found",
      variant: "success",
      payload: users,
      total,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      variant: "error",
      payload: null,
      total: 0,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        variant: "error",
        payload: null,
      });
    }
    res.status(200).json({
      msg: "User found",
      variant: "success",
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      variant: "error",
      payload: null,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error, warning } = validationUser(req.body);
    if (error) {
      return res.status(400).json({
        msg: error.details.map((detail) => detail.message).join(", "),
        variant: "error",
        payload: null,
      });
    }
    if (warning) {
      return res.status(400).json({
        msg: warning.details.map((detail) => detail.message).join(", "),
        variant: "warning",
        payload: null,
      });
    }

    let user = await Users.create(req.body);
    res.status(201).json({
      msg: "User created",
      variant: "success",
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      variant: "error",
      payload: null,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        variant: "error",
        payload: null,
      });
    }
    res.status(200).json({
      msg: "User deleted",
      variant: "success",
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      variant: "error",
      payload: null,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error, warning } = validationUser(req.body);
    if (error) {
      return res.status(400).json({
        msg: error.details.map((detail) => detail.message).join(", "),
        variant: "error",
        payload: null,
      });
    }
    if (warning) {
      return res.status(400).json({
        msg: warning.details.map((detail) => detail.message).join(", "),
        variant: "warning",
        payload: null,
      });
    }

    let user = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        variant: "error",
        payload: null,
      });
    }
    res.status(200).json({
      msg: "User updated",
      variant: "success",
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      variant: "error",
      payload: null,
    });
  }
});

export default router;
