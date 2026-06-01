const ActivityLog = require("../models/ActivityLog");

exports.getIssueActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      issueId: req.params.issueId,
    })
      .populate("userId", "name")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
