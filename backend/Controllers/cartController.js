const Cart = require("../models/Cart");
const Product = require("../models/Products");
const mongoose = require("mongoose");

exports.addToCart = async (req, res) => {
  try {
    const { productId, title, price, discountPrice, image, quantity = 1 } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      if (quantity > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
      }
      cart = new Cart({
        user: userId,
        items: [{ productId, title, price, discountPrice, image, quantity }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (index > -1) {
        const newQuantity = cart.items[index].quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock. You already have ${cart.items[index].quantity} in cart.` });
        }
        cart.items[index].quantity = newQuantity;
      } else {
        if (quantity > product.stock) {
          return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
        }
        cart.items.push({ productId, title, price, discountPrice, image, quantity });
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
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.productId", "stock");
    if (cart) {
      // Filter out items where productId is null (deleted products)
      const originalLength = cart.items.length;
      cart.items = cart.items.filter(item => item.productId !== null);
      
      // If items were filtered, save the cart to clean up ghost items permanently
      if (cart.items.length !== originalLength) {
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await cart.save();
      }
    }
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
      // Optional: Prevent removal on decrement if that's preferred, but keeping current behavior
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

exports.mergeCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: true, message: "No items to merge" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Fetch products to verify existence and stock
      const validItems = [];
      for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) continue;
        const product = await Product.findById(item.productId);
        if (product) {
          const quantityToAdd = Math.min(item.quantity || 1, product.stock);
          if (quantityToAdd > 0) {
            validItems.push({
              productId: item.productId,
              title: item.title,
              price: item.price,
              discountPrice: item.discountPrice,
              image: item.image,
              quantity: quantityToAdd,
            });
          }
        }
      }
      cart = new Cart({
        user: userId,
        items: validItems,
      });
    } else {
      for (const newItem of items) {
        if (!mongoose.Types.ObjectId.isValid(newItem.productId)) continue;
        const product = await Product.findById(newItem.productId);
        if (!product) continue;

        const index = cart.items.findIndex(
          (item) => item.productId.toString() === newItem.productId.toString(),
        );

        if (index > -1) {
          const totalNewQty = cart.items[index].quantity + (newItem.quantity || 1);
          cart.items[index].quantity = Math.min(totalNewQty, product.stock);
        } else {
          const quantityToAdd = Math.min(newItem.quantity || 1, product.stock);
          if (quantityToAdd > 0) {
            cart.items.push({
              productId: newItem.productId,
              title: newItem.title,
              price: newItem.price,
              discountPrice: newItem.discountPrice,
              image: newItem.image,
              quantity: quantityToAdd,
            });
          }
        }
      }
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();
    console.log(`Cart merged for user: ${userId}`);
    res.json({ success: true, message: "Cart merged successfully", cart });
  } catch (error) {
    console.error("Merge cart error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
