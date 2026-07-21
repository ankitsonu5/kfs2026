const AboutUs = require("../models/AboutUs");
const fs = require("fs");
const path = require("path");

exports.getAboutUs = async (req, res) => {
  try {
    let aboutData = await AboutUs.findOne();
    if (!aboutData) {
      // Create default if it doesn't exist
      aboutData = new AboutUs({});
      await aboutData.save();
    }
    res.json({ success: true, data: aboutData });
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateAboutUs = async (req, res) => {
  try {
    const { hero, features, specialOffer, team, stats } = req.body;
    let aboutData = await AboutUs.findOne();

    if (!aboutData) {
      aboutData = new AboutUs({});
    }

    if (hero) aboutData.hero = { ...aboutData.hero, ...JSON.parse(hero) };
    if (features) aboutData.features = JSON.parse(features);
    if (specialOffer) aboutData.specialOffer = { ...aboutData.specialOffer, ...JSON.parse(specialOffer) };
    if (team) aboutData.team = { ...aboutData.team, ...JSON.parse(team) };
    if (stats) aboutData.stats = { ...aboutData.stats, ...JSON.parse(stats) };

    // Handle files
    if (req.files) {
      if (req.files["heroImage"]) {
        aboutData.hero.image = req.files["heroImage"][0].filename;
      }
      if (req.files["offerImage1"]) {
        aboutData.specialOffer.image1 = req.files["offerImage1"][0].filename;
      }
      if (req.files["offerImage2"]) {
        aboutData.specialOffer.image2 = req.files["offerImage2"][0].filename;
      }
      if (req.files["statsBgImage"]) {
        aboutData.stats.backgroundImage = req.files["statsBgImage"][0].filename;
      }
      
      // Handle team member images dynamically
      if (aboutData.team && aboutData.team.members) {
        aboutData.team.members.forEach((member, index) => {
          const fieldName = `teamImage_${index}`;
          if (req.files[fieldName]) {
            member.image = req.files[fieldName][0].filename;
          }
        });
      }
    }

    await aboutData.save();
    res.json({ success: true, message: "About Us content updated successfully", data: aboutData });
  } catch (error) {
    console.error("Error updating About Us data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
