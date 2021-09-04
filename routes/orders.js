const { Order, validate } = require("../models/order");
const express = require("express");
const { Customer } = require("../models/customer");
const { Product } = require("../models/product");
const { Stock } = require("../models/stock");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("customer")
    .populate("product")
    .sort("name");
  res.send(orders);
});

// TODO ORDER直接删除,不更新
// 更新时提交一张完全新的订单
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid product.");

  // TODO not modify stock
  // const stock = await Stock.findOne({
  //   product: req.body.productId,
  //   quantity: { $gte: 0 },
  // });

  // if (stock === undefined) {
  //   return res.status(400).send("No stock available.");
  // } else {
  //   const newQuantity = stock.quantity - req.body.quantity;
  //   const newStock = await Stock.findByIdAndUpdate(
  //     stock._id,
  //     { quantity: newQuantity },
  //     {
  //       new: true,
  //     }
  //   );
  // }

  const order = new Order({
    customer: req.body.customerId,
    product: req.body.productId,
    quantity: req.body.quantity,
    price: req.body.price,
    coupon: req.body.coupon,
  });
  await order.save();
  res.send(order);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid product.");

  let order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).send("The Order with the given ID was not found.");

  order = await Order.updateOne(
    { _id: req.params.id },
    {
      $set: {
        customer: req.body.customerId,
        product: req.body.productId,
        quantity: req.body.quantity,
        price: req.body.price,
        coupon: req.body.coupon,
        customerPaid: req.body.customerPaid,
        enRoute: req.body.enRoute,
        customerReceived: req.body.customerReceived
      },
    }
  );

  res.send(order);
});

// router.delete("/:id", [auth, admin], async (req, res) => {
router.delete("/:id",  async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order)
    return res.status(404).send("The Order with the given ID was not found.");

  res.send(order);
});

router.get("/:id", async (req, res) => {
  const order =  await Order.findById(req.params.id)
    .populate("productId", "name -_id");

  if (!order)
    return res.status(404).send("The Order with the given ID was not found.");

  res.send(order);
});



module.exports = router;
