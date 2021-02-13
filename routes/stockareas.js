const { Stockarea, validate } = require("../models/stockarea");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const areas = await Stockarea.find().sort("name");
  res.send(areas);
});

module.exports = router;
