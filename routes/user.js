import express from "express";
import { Users, validationUser } from "../schema/userScheme.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";
dotenv.config();

const router = express.Router();

router.get("/", auth, async (req, res) => {
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
        total: 0,
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

router.post("/sign-up", async (req, res) => {
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
    const existUser = await Users.findOne({ username: req.body.username });
    if (existUser) {
      return res.status(400).json({
        msg: "User already exists",
        variant: "error",
        payload: null,
      });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    let user = await Users.create(req.body);

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      msg: "User created",
      variant: "success",
      payload: { user, token },
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      variant: "error",
      payload: null,
    });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { password, username } = req.body;
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(400).json({
        msg: "Username or password error",
        variant: "error",
        payload: null,
      });
    }
    bcrypt.compare(password, user.password, function (error, response) {
      const token = jwt.sign(
        { _id: user._id, role: "admin" },
        process.env.SECRET_KEY
      );
      if (response) {
        res.status(200).json({
          msg: "Successfully login",
          variant: "success",
          payload: { user, token },
        });
      } else {
        return res.status(400).json({
          msg: "Username or password error",
          variant: "error",
          payload: null,
        });
      }
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

    const { username } = req.body;
    const existingUser = await Users.findOne({ username });

    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(400).json({
        msg: "This username already exist",
        variant: "error",
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
      msg: "User successfully updated",
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
