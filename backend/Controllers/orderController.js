const Order = require("../models/Order");
const Cart = require("../models/Cart");
const ServiceArea = require("../models/ServiceArea");
const Product = require("../models/Products");
const User = require("../models/User");
const nodemailer = require("nodemailer");

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

    // --- STOCK VALIDATION AND DECREMENT ---
    for (const item of cart.items) {
      if (!item.productId) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${item.title} no longer exists.` 
        });
      }
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.productId.title}. Only ${item.productId.stock} left.` 
        });
      }
    }

    const userPincode = req.body.shippingAddress?.pincode ? req.body.shippingAddress.pincode.toString().trim() : "";
    const userCity = req.body.shippingAddress?.city ? req.body.shippingAddress.city.toString().trim() : "";

    if (!userCity || !userPincode) {
      return res.status(400).json({ success: false, message: "City and Pincode are required" });
    }

    const cityRegex = new RegExp(`^${userCity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i");

    const service = await ServiceArea.findOne({
      city: cityRegex,
      isActive: true,
      $or: [
        { pincode: userPincode },
        { pincode: "" },
        { pincode: null },
        { pincode: { $exists: false } }
      ]
    });

    if (!service) {
      return res.status(400).json({ success: false, message: "Delivery not available for this city / pincode combination" });
    }

    // Actually decrement stock
    for (const item of cart.items) {
      // Use Product.findById to get the latest document and update it safely
      const product = await Product.findById(item.productId._id);
      if (product) {
        const currentStock = Number(product.stock) || 0;
        const purchaseQty = Number(item.quantity) || 0;
        
        await Product.findByIdAndUpdate(item.productId._id, {
          $set: { stock: currentStock - purchaseQty }
        });
      }
    }
    // -------------------------------------

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity,
      image:
        item.image ||
        (item.productId.images && item.productId.images.length > 0
          ? item.productId.images[0]
          : ""),
    }));

    const deliveryCharge = cart.totalAmount >= 500 ? 0 : 50;
    const totalAmount = cart.totalAmount + deliveryCharge;

    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    await order.save();

    // Send Email Notification in the background
    (async () => {
      try {
        const AdminSettings = require("../models/AdminSettings");
        const settings = await AdminSettings.findOne() || {};

        const supportEmail = settings.supportEmail || "kfs24x7@gmail.com";
        const supportEmail2 = settings.supportEmail2 || "";
        const primaryPhone = settings.primaryPhone || "+91 8800145844";
        const secondaryPhone = settings.secondaryPhone || "";

        const adminEmail = process.env.ADMIN_EMAIL;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (smtpUser && smtpPass) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

                    const itemsHtml = orderItems.map(item => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                <strong>${item.name}</strong>
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                ${item.quantity}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                ₹${item.price}
              </td>
            </tr>
          `).join("");

          const emailTemplate = (title, headerText, isCustomer) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; color: #374151;">
              <div style="background-color: #16a34a; padding: 24px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">KFS</h1>
                <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">${title}</p>
              </div>
              
              <div style="padding: 32px 24px;">
                <h2 style="margin-top: 0; color: #16a34a; font-size: 20px;">${headerText}</h2>
                ${isCustomer ? `<p style="font-size: 16px; line-height: 1.5;">We have successfully received your order. We'll send you another email when it ships.</p>` : ''}
                
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${order._id}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Payment Method:</strong> <span style="text-transform: uppercase;">${paymentMethod}</span></p>
                  <p style="margin: 0;"><strong>Total Amount:</strong> <span style="color: #16a34a; font-size: 18px; font-weight: bold;">₹${totalAmount}</span></p>
                </div>

                <h3 style="color: #374151; font-size: 18px; margin-bottom: 16px; border-bottom: 2px solid #16a34a; padding-bottom: 8px; display: inline-block;">Shipping Details</h3>
                <p style="margin: 0 0 4px 0;"><strong>${shippingAddress.fullName}</strong></p>
                <p style="margin: 0 0 4px 0;">📞 ${shippingAddress.phone}</p>
                <p style="margin: 0 0 24px 0; line-height: 1.5;">🏠 ${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}</p>

                <h3 style="color: #374151; font-size: 18px; margin-bottom: 16px; border-bottom: 2px solid #16a34a; padding-bottom: 8px; display: inline-block;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                      <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                      <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding: 16px 12px; text-align: right; font-weight: bold; border-bottom: 2px solid #16a34a;">Total:</td>
                      <td style="padding: 16px 12px; text-align: right; font-weight: bold; color: #16a34a; border-bottom: 2px solid #16a34a; font-size: 18px;">₹${totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
                
                ${isCustomer ? `<p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 32px;">Thanks for shopping with KFS!</p>` : ''}
                <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px; text-align: center; font-size: 12px; color: #6b7280;">
                  <p style="margin: 0 0 4px 0;">If you have any questions, contact us:</p>
                  <p style="margin: 0 0 4px 0;">📞 ${primaryPhone}${secondaryPhone ? ` / ${secondaryPhone}` : ''}</p>
                  <p style="margin: 0;">✉️ ${supportEmail}${supportEmail2 ? ` / ${supportEmail2}` : ''}</p>
                </div>
              </div>
            </div>
          `;

          // 1. Send to Admin
          if (adminEmail) {
            const adminMailOptions = {
              from: smtpUser,
              to: adminEmail,
              subject: `New Order Placed: ${order._id}`,
              html: emailTemplate("Admin Alert", "New Order Received!", false),
            };
            await transporter.sendMail(adminMailOptions);
            // console.log("Admin email notification sent successfully.");
          }

          // 2. Send to Customer
          const user = await User.findById(userId);
          if (user && user.email) {
            const customerMailOptions = {
              from: smtpUser,
              to: user.email,
              subject: `Order Confirmation - KFS #${order._id}`,
              html: emailTemplate("Order Confirmation", `Thank you for your order, ${shippingAddress.fullName}!`, true),
            };
            await transporter.sendMail(customerMailOptions);
            // console.log("Customer email notification sent successfully to " + user.email);
          }
        }
      } catch (err) {
        console.error("Failed to send email notifications:", err);
      }
    })();

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    cart.markModified("items");
    await cart.save();

    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.log("Place order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
      .populate("userId", "fullName email")
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
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation for Placed or Confirmed orders
    if (!["Placed", "Confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Order cannot be cancelled as it is already ${order.orderStatus}`,
      });
    }

    // RESTORE STOCK
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const currentStock = Number(product.stock) || 0;
        const refundQty = Number(item.quantity) || 0;
        await Product.findByIdAndUpdate(item.productId, {
          $set: { stock: currentStock + refundQty }
        });
      }
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// User - Delete order history
exports.userDeleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow deletion for Cancelled or Delivered orders
    if (!["Cancelled", "Delivered"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Active orders cannot be deleted. Current status: ${order.orderStatus}`,
      });
    }

    await Order.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order deleted from history" });
  } catch (error) {
    console.error("User delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
