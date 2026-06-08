const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Testing", "Done", "Blocked"],
      default: "Todo",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["Bug", "Feature", "Task", "Improvement", "Hotfix"],
      default: "Task",
    },

    component: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "API",
        "Database",
        "DevOps",
        "Mobile",
        "UI/UX",
        "Other",
      ],
      default: "Other",
    },

    tags: [
      {
        type: String,
      },
    ],

    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Issue", issueSchema);
