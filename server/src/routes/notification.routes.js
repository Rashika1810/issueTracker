const express = require("express");

const router = express.Router();



const {
  getNotifications,
  markAsRead,
  markAllRead,
} = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getNotifications);

router.put("/read-all", authMiddleware, markAllRead);

router.put("/:id/read", authMiddleware, markAsRead);


module.exports = router;
