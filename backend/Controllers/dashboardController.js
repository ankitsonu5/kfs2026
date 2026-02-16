const Product = require("../models/Products");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total sales
    const salesData = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Get recent data (last 7 days count per day for graph)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProducts = await Product.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build 7-day data for graphs
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const productGraph = days.map((day) => {
      const found = recentProducts.find((r) => r._id === day);
      return { day: day.slice(5), count: found ? found.count : 0 };
    });

    const userGraph = days.map((day) => {
      const found = recentUsers.find((r) => r._id === day);
      return { day: day.slice(5), count: found ? found.count : 0 };
    });

    const orderGraph = days.map((day) => {
      const found = recentOrders.find((r) => r._id === day);
      return { day: day.slice(5), count: found ? found.count : 0 };
    });

    const recentOrdersList = await Order.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      totalProducts,
      totalUsers,
      totalOrders,
      totalSales,
      productGraph,
      userGraph,
      orderGraph,
      recentOrders: recentOrdersList,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add getAllUsers for the dashboard
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add deleteUser for the dashboard
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin before deleting
    const targetUser = await User.findById(id);
    if (targetUser && targetUser.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin users cannot be deleted" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete user's cart
    await Cart.findOneAndDelete({ user: id });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
