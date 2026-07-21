const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  hero: {
    subtitle: { type: String, default: "Welcome to kFS24x7" },
    title: { type: String, default: "Fresh Grocery Delivered to Your Door" },
    description: { type: String, default: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested." },
    image: { type: String, default: "/aboutus/aboutsideimage.webp" },
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "/shop" }
  },
  features: {
    type: [{
      title: { type: String },
      description: { type: String },
      linkText: { type: String },
      linkUrl: { type: String }
    }],
    default: [
      {
        title: "Best Discounts",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
        linkText: "Shop Now",
        linkUrl: "/shop"
      },
      {
        title: "Great Daily Deal",
        description: "And is completely undo sent. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        linkText: "Read More",
        linkUrl: "/shop"
      },
      {
        title: "Free Delivery",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
        linkText: "Contact",
        linkUrl: "/contact"
      }
    ]
  },
  specialOffer: {
    title: { type: String, default: "Special Offer" },
    subtitle: { type: String, default: "Summer Sale" },
    description: { type: String, default: "Get up to 50% off on all organic fruits and vegetables this summer." },
    image1: { type: String, default: "/aboutus/aboutus1.webp" },
    image2: { type: String, default: "/aboutus/aboutus2.webp" },
    buttonText: { type: String, default: "Read More" },
    buttonLink: { type: String, default: "/shop" },
    features: {
      type: [{
        title: { type: String },
        description: { type: String }
      }],
      default: [
        { title: "Natural Products", description: "It is a long established fact that a reader will be distracted." },
        { title: "Best Food For Health", description: "The standard chunk of Lorem Ipsum used since the 1500s." }
      ]
    }
  },
  team: {
    subtitle: { type: String, default: "Our Team" },
    title: { type: String, default: "Our Farm Land Farmers" },
    members: {
      type: [{
        name: { type: String },
        role: { type: String },
        email: { type: String },
        image: { type: String }
      }],
      default: [
        { name: "Alex Maxwell", role: "CEO & Founder", email: "support@xstore.com", image: "" },
        { name: "Justin Roberto", role: "Manager", email: "support@xstore.com", image: "" },
        { name: "Louis Agassiz", role: "Organic Farmer", email: "support@xstore.com", image: "" },
        { name: "Carl Anderson", role: "Agricultural", email: "support@xstore.com", image: "" }
      ]
    }
  },
  stats: {
    subtitle: { type: String, default: "Our Numbers" },
    title: { type: String, default: "Convincing Facts" },
    backgroundImage: { type: String, default: "/aboutus/factsbg.webp" },
    items: {
      type: [{
        number: { type: String },
        suffix: { type: String },
        label: { type: String }
      }],
      default: [
        { number: "5", suffix: "+", label: "Glorious Years" },
        { number: "35", suffix: "+", label: "Happy Clients" },
        { number: "25", suffix: "+", label: "Projects Complete" },
        { number: "10", suffix: "+", label: "Team Advisor" }
      ]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("AboutUs", aboutUsSchema);
