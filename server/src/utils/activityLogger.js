const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({ issueId, userId, action, metadata = {} }) => {
  try {
    await ActivityLog.create({
      issueId,
      userId,
      action,
      metadata,
    });
  } catch (error) {
    console.error("Activity log failed:", error);
  }
};

module.exports = logActivity;
