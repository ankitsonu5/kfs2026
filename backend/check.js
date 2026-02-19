try {
  const Wishlist = require("./models/Wishlist");
  console.log("Wishlist model loaded successfully");
  const wishlistController = require("./Controllers/wishlistController");
  console.log("Wishlist controller loaded successfully");
  const wishlistRoutes = require("./routes/wishlistRoutes");
  console.log("Wishlist routes loaded successfully");
  const server = require("./server"); // This might try to start the server
  console.log("Server file loaded successfully");
} catch (error) {
  console.error("Error loading modules:", error);
}
