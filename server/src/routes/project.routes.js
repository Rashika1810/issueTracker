const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createProject,
  getProjects,
  getProjectById,
  getProjectMembers,
  addProjectMember,
  deleteProject
} = require("../controllers/project.controller");

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.get("/:id", authMiddleware, getProjectById);

router.get("/:id/members", authMiddleware, getProjectMembers);

router.post("/:id/members", authMiddleware, addProjectMember);

router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
