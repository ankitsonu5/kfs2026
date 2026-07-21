const express = require("express");
const router = express.Router();
const aboutUsController = require("../Controllers/aboutUsController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

const uploadFields = [
  { name: 'heroImage', maxCount: 1 },
  { name: 'offerImage1', maxCount: 1 },
  { name: 'offerImage2', maxCount: 1 },
  { name: 'statsBgImage', maxCount: 1 },
  { name: 'teamImage_0', maxCount: 1 },
  { name: 'teamImage_1', maxCount: 1 },
  { name: 'teamImage_2', maxCount: 1 },
  { name: 'teamImage_3', maxCount: 1 },
  { name: 'teamImage_4', maxCount: 1 },
  { name: 'teamImage_5', maxCount: 1 },
  { name: 'teamImage_6', maxCount: 1 },
  { name: 'teamImage_7', maxCount: 1 },
  { name: 'teamImage_8', maxCount: 1 },
  { name: 'teamImage_9', maxCount: 1 },
];

router.get("/aboutus", aboutUsController.getAboutUs);
router.put("/aboutus", auth, upload.fields(uploadFields), aboutUsController.updateAboutUs);

module.exports = router;
