const USER = require("../models/USER");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { isValidObjectId } = require("mongoose");

const registerUser = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp.status(422).json({ error: "please add all the fields" });
    }
    const userExists = await USER.findOne({ email });
    if (userExists) {
      return resp
        .status(422)
        .json({ error: "user already exists with this email" });
    }
    const user = new USER({ email, password });
    await user.save();
    resp
      .status(201)
      .json({ message: "User registered successfully , please login!", user });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "internal server error" });
  }
};

const loginUser = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp.status(422).json({ error: "please add all the fields" });
    }
    const user = await USER.findOne({ email });
    if (!user) {
      return resp
        .status(422)
        .json({ error: "No account found with this email, please register" });
    }
    if (password != user.password) {
      return resp.status(422).json({ error: "password is incorrect" });
    }
    const token = jwt.sign({ _id: user._id }, "OKOKOKO12345", {
      expiresIn: "2h",
    });
    resp.cookie("jwtToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expiresIn: new Date().getHours() + 2,
    });
    return resp
      .status(200)
      .json({ message: "user logged in successfully", user, token });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "internal server error" });
  }
};

const loggedUser = async (req, resp) => {
  try {
    const userId = await req.user._id;
    if (isValidObjectId(userId)) {
      return resp.status(200).json(req.user);
    }
    return resp.status(401).json({ error: "Un authorized user" });
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async (req, resp) => {
  try {
    if (req.user) {
      resp.clearCookie("jwtToken", {
        path: "/",
      });
      return resp.status(200).json({ message: "user logged out successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { registerUser, loginUser, logoutUser, loggedUser };
