const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/project.controller");

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.get("/:id", authMiddleware, getProjectById);

module.exports = router;
