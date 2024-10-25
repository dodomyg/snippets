const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  loggedUser,
} = require("../controller/userController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/jwt", verifyToken, loggedUser);
router.post("/logout", verifyToken, logoutUser);

module.exports = router;
