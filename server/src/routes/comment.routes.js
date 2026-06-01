const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createComment,
  getCommentsByIssue,
} = require("../controllers/comment.controller");

router.post("/", authMiddleware, createComment);

router.get("/:issueId", authMiddleware, getCommentsByIssue);

module.exports = router;
