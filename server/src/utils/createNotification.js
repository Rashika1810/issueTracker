const Notification = require("../models/Notification");
const { getIO } = require("../socket");

const createNotification = async ({
  userId,
  type,
  message,
}) => {
  const notification =
    await Notification.create({
      userId,
      type,
      message,
    });

  const io = getIO();

  if (io) {
    io.to(userId.toString()).emit(
      "notification",
      notification
    );
  }

  return notification;
};

module.exports = createNotification;