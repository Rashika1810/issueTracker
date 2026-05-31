const Organization = require("../models/Organization");

// Create Organization
exports.createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const existingOrganization = await Organization.findOne({
      ownerId: req.user.id,
    });

    if (existingOrganization) {
      return res.status(400).json({
        success: false,
        message: "You already have an organization",
      });
    }
    const organization = await Organization.create({
      name,
      ownerId: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({
      success: true,
      organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Organization
exports.getMyOrganization = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      ownerId: req.user.id,
    });

    if (!organization) {
      return res.status(200).json({
        success: true,
        organization: null,
      });
    }

    res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Organization By Id
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate(
      "members",
      "name email",
    );

    res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
