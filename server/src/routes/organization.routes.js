const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createOrganization,
  getMyOrganization,
  getOrganizationById,
} = require("../controllers/organization.controller");

router.post("/", authMiddleware, createOrganization);

router.get("/my", authMiddleware, getMyOrganization);

router.get("/:id", authMiddleware, getOrganizationById);

module.exports = router;
