const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Stock, validate } = require("../models/stock");
const { Product } = require("../models/product");
const { Stockarea } = require("../models/stockarea");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let stocks = undefined;
    if (req.query.area) {
      // await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();
      stocks = await Stock.find({ area: req.query.area })
        .populate("area")
        .populate("product");
    } else {
      stocks = await Stock.find()
        .populate("area")
        .populate("product")
        .sort("expiredDate");
    }

    res.send(stocks);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const area = await Stockarea.findById(req.body.areaId);
  if (!area) return res.status(400).send("Invalid stock area.");

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid product.");

  let stock = new Stock({
    area: req.body.areaId,
    product: req.body.productId,
    quantity: req.body.quantity,
    expiredDate: req.body.eDate,
  });
  stock = await stock.save();

  res.send(stock);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const stock = await Genre.findByIdAndUpdate(
    req.params.id,
    { quantity: req.body.quantity },
    {
      new: true,
    }
  );

  if (!stock)
    return res.status(404).send("The stock with the given ID was not found.");

  res.send(stock);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const stock = await Stock.findByIdAndRemove(req.params.id);

  if (!stock)
    return res.status(404).send("The stock with the given ID was not found.");

  res.send(stock);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock)
    return res.status(404).send("The stock with the given ID was not found.");

  res.send(stock);
});

module.exports = router;
