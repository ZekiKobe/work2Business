const Notification = require("../models/Notification");

// GET /notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// PATCH /notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, notification: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark notification as read" });
  }
};

// PATCH /notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark notifications as read" });
  }
};

// Helper: create a notification (called from other controllers)
exports.createNotification = async (userId, type, title, message, link = null) => {
  try {
    await Notification.create({ user: userId, type, title, message, link });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};
