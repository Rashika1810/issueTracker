const Issue = require("../models/Issue");
const logActivity = require("../utils/activityLogger");
exports.createIssue = async (req, res) => {
  try {
    const { projectId, title, description, priority } = req.body;

    const issue = await Issue.create({
      projectId,
      title,
      description,
      priority,
      reporter: req.user.id,
    });

    res.status(201).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProjectIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      projectId: req.params.projectId,
    })
      .populate("reporter", "name email")
      .populate("assignee", "name email");

    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reporter", "name email")
      .populate("assignee", "name email");

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const { status, priority, assignee, dueDate } = req.body;
    const existingIssue = await Issue.findById(req.params.id);
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        status,
        priority,
        assignee,
        dueDate,
      },
      {
        new: true,
      },
    );
    if (status && status !== existingIssue.status) {
      await logActivity({
        issueId: issue._id,
        userId: req.user.id,
        action: "STATUS_CHANGED",
        metadata: {
          from: existingIssue.status,
          to: status,
        },
      });
    }
    if (priority && priority !== existingIssue.priority) {
      await logActivity({
        issueId: issue._id,
        userId: req.user.id,
        action: "PRIORITY_CHANGED",
        metadata: {
          from: existingIssue.priority,
          to: priority,
        },
      });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
