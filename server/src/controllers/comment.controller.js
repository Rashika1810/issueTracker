const Comment = require("../models/Comment");
const logActivity = require("../utils/activityLogger");
const Issue = require("../models/Issue");
const { getIO } = require("../socket");

exports.createComment = async (req, res) => {
  try {
    const { issueId, text } = req.body;
    if (!text?.trim() && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Comment or attachment required",
      });
    }
    const commentData = {
      issueId,
      userId: req.user.id,
      text,
    };

    if (req.file) {
      commentData.attachment = {
        fileName: req.file.originalname,

        fileUrl: "/uploads/" + req.file.filename,

        mimeType: req.file.mimetype,
      };
    }

    const comment = await Comment.create(commentData);

    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "name email",
    );

    await logActivity({
      issueId,
      userId: req.user.id,
      action: "COMMENT_ADDED",
    });

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
