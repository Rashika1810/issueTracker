const Project = require("../models/Project");
const Organization = require("../models/Organization");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const organization = await Organization.findOne({
      ownerId: req.user.id,
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const project = await Project.create({
      organizationId: organization._id,
      name,
      description,
      ownerId: req.user.id,
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
    const project = await Project.findById(req.params.id);

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
