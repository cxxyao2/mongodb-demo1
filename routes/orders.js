const { Order, validate } = require("../models/order");
const express = require("express");
const { Customer } = require("../models/customer");
const { Product } = require("../models/product");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  // TODO populate customerName, productName,
  const orders = await Order.find()
    .populate("customer")
    .populate("product")
    .sort("name");
  res.send(orders);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid product.");

  const order = new Order({
    customer: req.body.customerId,
    product: req.body.productId,
    quantity: req.body.quantity,
    price: req.body.price,
    coupon: req.body.coupon,
    customerPaid: req.body.customerPaid,
    enRoute: req.body.enRoute,
    customerReceived: req.body.customerReceived,
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

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      customer: req.body.customerId,
      product: req.body.productId,
      quantity: req.body.quantity,
      price: req.body.price,
      coupon: req.body.coupon,
      customerPaid: req.body.customerPaid,
      enRoute: req.body.enRoute,
      customerReceived: req.body.customerReceived,
    },
    {
      new: true,
    }
  );

  if (!order)
    return res.status(404).send("The Order with the given ID was not found.");

  res.send(order);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order)
    return res.status(404).send("The Order with the given ID was not found.");

  res.send(order);
});

router.get("/:id", async (req, res) => {
  const order = await (await Order.findById(req.params.id))
    .populate("productId", "name -_id")
    .select("");

  if (!order)
    return res.status(404).send("The Order with the given ID was not found.");

  res.send(order);
});

module.exports = router;
