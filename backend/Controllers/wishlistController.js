const Wishlist = require("../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId, title, price, image } = req.body;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [{ productId, title, price, image }],
      });
    } else {
      const exists = wishlist.items.some(
        (item) => item.productId.toString() === productId,
      );

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }

      wishlist.items.push({ productId, title, price, image });
    }

    wishlist.updatedAt = Date.now();
    await wishlist.save();

    res.json({ success: true, message: "Added to Wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    res.json(wishlist || { items: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    wishlist.updatedAt = Date.now();
    await wishlist.save();

    res.json({ success: true, message: "Removed from Wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
