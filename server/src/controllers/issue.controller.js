const Issue = require("../models/Issue");
const logActivity = require("../utils/activityLogger");
const User = require("../models/User");
const Project = require("../models/Project");
const createNotification = require("../utils/createNotification");
const { getIO } = require("../socket");
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
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.toString() === req.user.id,
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

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

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const project = await Project.findById(issue.projectId);

    const isMember = project.members.some(
      (member) => member.toString() === req.user.id,
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
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

exports.updateIssue = async (req, res) => {
  try {
    const { status, priority, assignee, dueDate } = req.body;

    const existingIssue = await Issue.findById(req.params.id);

    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

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
    const io = getIO();

    const populatedIssue = await Issue.findById(issue._id)
      .populate("reporter", "name email")
      .populate("assignee", "name email");

    io.to(issue.projectId.toString()).emit("issue-updated", populatedIssue);
    // Status Change
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

    // Priority Change
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

    // Assignee Change
    if (assignee && assignee !== existingIssue.assignee?.toString()) {
      console.log("ASSIGNEE CHANGED");
      const oldAssignee = existingIssue.assignee
        ? await User.findById(existingIssue.assignee).select("name")
        : null;

      const newAssignee = await User.findById(assignee).select("name");

      await logActivity({
        issueId: issue._id,
        userId: req.user.id,
        action: "ASSIGNEE_CHANGED",
        metadata: {
          from: oldAssignee?.name || "Unassigned",
          to: newAssignee?.name || "Unknown",
        },
      });
    }
    if (assignee && assignee !== existingIssue.assignee?.toString()) {
      await createNotification({
        userId: assignee,
        type: "ISSUE_ASSIGNED",
        message: `${req.user.name} assigned issue "${issue.title}" to you`,
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
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      assignee: req.user.id,
    })
      .populate("projectId", "name")
      .populate("reporter", "name email")
      .sort({
        updatedAt: -1,
      });

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
