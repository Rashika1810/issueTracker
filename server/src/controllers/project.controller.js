const Project = require("../models/Project");
const Organization = require("../models/Organization");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const organization = await Organization.findOne({
      ownerId: req.user.id,
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }
    const projectMembers = [...new Set([req.user.id, ...(members || [])])];
    const project = await Project.create({
      organizationId: organization._id,
      name,
      description,
      ownerId: req.user.id,
      members: projectMembers,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      ownerId: req.user.id,
    });

    const projects = await Project.find({
      organizationId: organization._id,
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Project By Id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    ).populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member._id.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email",
    );

    res.status(200).json({
      success: true,
      members: project.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already member",
      });
    }

    project.members.push(userId);

    await project.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
