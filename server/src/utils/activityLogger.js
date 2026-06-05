const ActivityLog = require("../models/ActivityLog");
const { getIO } = require("../socket");

const logActivity = async ({ issueId, userId, action, metadata = {} }) => {
  try {
    const activity = await ActivityLog.create({
      issueId,
      userId,
      action,
      metadata,
    });

    const populatedActivity = await ActivityLog.findById(activity._id)
      .populate("userId", "name email")
      .populate("issueId", "_id");

    const io = getIO();

    if (io) {
      io.emit("activity-added", populatedActivity);
    }
  } catch (error) {
    console.error("Activity log failed:", error);
  }
};

module.exports = logActivity;
