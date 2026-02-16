const Order = require("../models/Order");
const Cart = require("../models/Cart");

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
