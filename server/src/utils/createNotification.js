const Notification = require("../models/Notification");

const createNotification = async ({ userId, type, message }) => {
  return Notification.create({
    userId,
    type,
    message,
  });
};

module.exports = createNotification;
