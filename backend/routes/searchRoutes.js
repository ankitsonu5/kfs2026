const express = require("express");
const router = express.Router();
const { searchAll } = require("../Controllers/searchController");

router.get("/search", searchAll);

module.exports = router;
