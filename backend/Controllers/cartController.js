const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {
    const { productId, title, price, image } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ productId, title, price, image, quantity: 1 }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (index > -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({ productId, title, price, image, quantity: 1 });
      }
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    res.json({ success: true, message: "Added to Cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    res.json(cart || { items: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();
    res.json({ success: true, message: "Removed from Cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.decrementCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not in cart" });
    }

    if (cart.items[index].quantity > 1) {
      cart.items[index].quantity -= 1;
    } else {
      cart.items.splice(index, 1);
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();
    res.json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
