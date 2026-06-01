const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const { getIssueActivity } = require("../controllers/activity.controller");

router.get("/:issueId", authMiddleware, getIssueActivity);

module.exports = router;
