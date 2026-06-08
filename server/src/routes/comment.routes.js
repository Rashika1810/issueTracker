const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createComment,
  getCommentsByIssue,
} = require("../controllers/comment.controller");

const upload = require("../middleware/upload");

router.post("/", authMiddleware, upload.single("file"), createComment);

router.get("/:issueId", authMiddleware, getCommentsByIssue);

module.exports = router;
