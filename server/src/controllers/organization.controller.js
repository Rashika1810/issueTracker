const Organization = require("../models/Organization");
const User = require("../models/User");
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
    }).populate("members", "name email");

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
exports.getMembers = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate(
      "members",
      "name email",
    );

    res.status(200).json({
      success: true,
      members: organization.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const organization = await Organization.findOne({
      ownerId: req.user.id,
    });

    if (organization.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "Already member",
      });
    }

    organization.members.push(user._id);

    await organization.save();

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
