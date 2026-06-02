const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createOrganization,
  getMyOrganization,
  getOrganizationById,
  getMembers,
  inviteMember
} = require("../controllers/organization.controller");

router.post("/", authMiddleware, createOrganization);

router.get("/my", authMiddleware, getMyOrganization);

router.get("/:id", authMiddleware, getOrganizationById);

router.get("/:id/members", authMiddleware, getMembers);

router.post("/invite", authMiddleware, inviteMember);

module.exports = router;
