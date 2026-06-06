const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createIssue,
  getProjectIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getMyIssues,
} = require("../controllers/issue.controller");

router.post("/", authMiddleware, createIssue);

router.get("/project/:projectId", authMiddleware, getProjectIssues);

router.get("/my-issues", authMiddleware, getMyIssues);

router.get("/:id", authMiddleware, getIssueById);

router.put("/:id", authMiddleware, updateIssue);

router.delete("/:id", authMiddleware, deleteIssue);


module.exports = router;
