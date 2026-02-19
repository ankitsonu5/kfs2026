const Product = require("../models/Products");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.getDashboardStats = async (req, res) => {
  try {
    const { range } = req.query;
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total sales
    const salesData = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Determine time range
    let startDate = new Date();
    let numDays = 7;
    let format = "%Y-%m-%d";

    if (range === "1d") {
      startDate.setHours(startDate.getHours() - 24);
      numDays = 24;
      format = "%Y-%m-%d %H:00";
    } else if (range === "30d") {
      startDate.setDate(startDate.getDate() - 30);
      numDays = 30;
    } else if (range === "any") {
      startDate = new Date(0); // Beginning of time
      numDays = 30; // Still show last 30 for graph fluidity or adjust as needed
    } else {
      // Default 7 days
      startDate.setDate(startDate.getDate() - 7);
      numDays = 7;
    }

    const matchFilter = { createdAt: { $gte: startDate } };

    const recentProducts = await Product.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: format, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentUsers = await User.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: format, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: format, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build timeline data
    const timeline = [];
    if (range === "1d") {
      for (let i = 23; i >= 0; i--) {
        const d = new Date();
        d.setHours(d.getHours() - i, 0, 0, 0);
        timeline.push(
          d.toISOString().split("T")[0] +
            " " +
            d.getHours().toString().padStart(2, "0") +
            ":00",
        );
      }
    } else {
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        timeline.push(d.toISOString().split("T")[0]);
      }
    }

    const productGraph = timeline.map((point) => {
      const found = recentProducts.find((r) => r._id === point);
      return {
        day: range === "1d" ? point.split(" ")[1] : point.slice(5),
        count: found ? found.count : 0,
      };
    });

    const userGraph = timeline.map((point) => {
      const found = recentUsers.find((r) => r._id === point);
      return {
        day: range === "1d" ? point.split(" ")[1] : point.slice(5),
        count: found ? found.count : 0,
      };
    });

    const orderGraph = timeline.map((point) => {
      const found = recentOrders.find((r) => r._id === point);
      return {
        day: range === "1d" ? point.split(" ")[1] : point.slice(5),
        count: found ? found.count : 0,
      };
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
