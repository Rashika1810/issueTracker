const Comment = require("../models/Comment");
const logActivity = require("../utils/activityLogger");
const Issue = require("../models/Issue");
const { getIO } = require("../socket");
exports.createComment = async (req, res) => {
  try {
    const { issueId, text } = req.body;

    const comment = await Comment.create({
      issueId,
      userId: req.user.id,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "name email",
    );

    await logActivity({
      issueId,
      userId: req.user.id,
      action: "COMMENT_ADDED",
    });

    const issue = await Issue.findById(issueId);

    const io = getIO();

    if (io && issue) {
      io.to(issue.projectId.toString()).emit("comment-added", populatedComment);
    }

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCommentsByIssue = async (req, res) => {
  try {
    const comments = await Comment.find({
      issueId: req.params.issueId,
    })
      .populate("userId", "name email")
      .sort({
        createdAt: 1,
      });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
