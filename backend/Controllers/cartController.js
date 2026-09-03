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

    const effectiveQuantity = Number(quantity) || 1;
    const isBulkEligible = product.bulkPrice > 0 && effectiveQuantity >= (product.bulkMinQty || 1);
    const itemUnitPrice = isBulkEligible ? product.bulkPrice : (price !== undefined && price !== null && Number(price) > 0 ? Number(price) : product.price);

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      if (effectiveQuantity > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
      }
      cart = new Cart({
        user: userId,
        items: [{ productId, title: title || product.title, price: itemUnitPrice, discountPrice: discountPrice || product.discountPrice, image: image || product.images?.[0] || "", quantity: effectiveQuantity }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (index > -1) {
        const newQuantity = cart.items[index].quantity + effectiveQuantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock. You already have ${cart.items[index].quantity} in cart.` });
        }
        cart.items[index].quantity = newQuantity;
        // Update price if bulk threshold is now reached
        if (product.bulkPrice > 0 && newQuantity >= (product.bulkMinQty || 1)) {
          cart.items[index].price = product.bulkPrice;
        }
      } else {
        if (effectiveQuantity > product.stock) {
          return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
        }
        cart.items.push({ productId, title: title || product.title, price: itemUnitPrice, discountPrice: discountPrice || product.discountPrice, image: image || product.images?.[0] || "", quantity: effectiveQuantity });
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
          const quantityToAdd = Math.min(Number(item.quantity) || 1, product.stock);
          if (quantityToAdd > 0) {
            const isBulk = product.bulkPrice > 0 && quantityToAdd >= (product.bulkMinQty || 1);
            const unitPrice = isBulk ? product.bulkPrice : (item.price || product.price);
            validItems.push({
              productId: item.productId,
              title: item.title || product.title,
              price: unitPrice,
              discountPrice: item.discountPrice || product.discountPrice,
              image: item.image || product.images?.[0] || "",
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
          const totalNewQty = cart.items[index].quantity + (Number(newItem.quantity) || 1);
          const finalQty = Math.min(totalNewQty, product.stock);
          cart.items[index].quantity = finalQty;
          if (product.bulkPrice > 0 && finalQty >= (product.bulkMinQty || 1)) {
            cart.items[index].price = product.bulkPrice;
          }
        } else {
          const quantityToAdd = Math.min(Number(newItem.quantity) || 1, product.stock);
          if (quantityToAdd > 0) {
            const isBulk = product.bulkPrice > 0 && quantityToAdd >= (product.bulkMinQty || 1);
            const unitPrice = isBulk ? product.bulkPrice : (newItem.price || product.price);
            cart.items.push({
              productId: newItem.productId,
              title: newItem.title || product.title,
              price: unitPrice,
              discountPrice: newItem.discountPrice || product.discountPrice,
              image: newItem.image || product.images?.[0] || "",
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
