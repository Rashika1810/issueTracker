const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const organizationRoutes = require("./routes/organization.routes");
const projectRoutes = require("./routes/project.routes");
const issueRoutes = require("./routes/issue.routes");
const commentRoutes = require("./routes/comment.routes");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IssueMind API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;
