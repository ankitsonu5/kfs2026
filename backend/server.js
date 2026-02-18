require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminProfileRoutes = require("./routes/adminProfileRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const userProfileRoutes = require("./routes/userProfile");
const orderRoutes = require("./routes/orderRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());
connectDB();

app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", categoryRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", adminProfileRoutes);
app.use("/", adminSettingsRoutes);
app.use("/", userProfileRoutes);
app.use("/", orderRoutes);
app.use("/", bannerRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${process.env.PORT || 8080}`);
});
