const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Products");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.productId",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    // Check stock availability before placing order
    for (const item of cart.items) {
      const product = item.productId;
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product ? product.title : "unknown product"}. Available: ${product ? product.stock : 0}`,
        });
      }
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image,
    }));

    const totalAmount = cart.totalAmount;

    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    await order.save();

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    cart.markModified("items");
    await cart.save();

    res.json({ success: true, message: "Order placed", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//  User orders
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Admin - all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true },
    );

    res.json({ success: true, message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Delete order (admin)
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User - Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, userId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Order already cancelled" });
    }

    if (!["Placed", "Confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in ${order.orderStatus} status`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
