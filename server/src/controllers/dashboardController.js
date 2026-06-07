const Project = require("../models/Project");
const Issue = require("../models/Issue");
const ActivityLog = require("../models/ActivityLog");

exports.getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    });

    const projectIds = projects.map((project) => project._id);

    const issues = await Issue.find({
      projectId: {
        $in: projectIds,
      },
    });

    const now = new Date();

    const stats = {
      projects: projects.length,

      totalIssues: issues.length,

      open: issues.filter((issue) => issue.status === "Todo").length,

      inProgress: issues.filter((issue) => issue.status === "In Progress")
        .length,

      testing: issues.filter((issue) => issue.status === "Testing").length,

      done: issues.filter((issue) => issue.status === "Done").length,

      overdue: issues.filter(
        (issue) =>
          issue.status !== "Done" &&
          issue.dueDate &&
          new Date(issue.dueDate) < now,
      ).length,
    };

    const recentActivity = await ActivityLog.find()
      .populate("userId", "name")
      .populate("issueId", "title")
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.status(200).json({
      success: true,
      stats,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
