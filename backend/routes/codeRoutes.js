const express = require("express");

const verifyToken = require("../middleware/verifyToken");
const { getSingleSnippet } = require("../controller/codeController");
const { createSnippet } = require("../controller/codeController");
const { getSnippet } = require("../controller/codeController");
const { updateSnippet } = require("../controller/codeController");
const { deleteSnippet } = require("../controller/codeController");

const router = express.Router();

router.post("/create", verifyToken, createSnippet);
router.get("/get", getSnippet);
router.get("/get_single/:id", getSingleSnippet);
router.patch("/update/:id", verifyToken, updateSnippet);
router.delete("/delete/:id", verifyToken, deleteSnippet);

module.exports = router;
