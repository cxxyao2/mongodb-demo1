// collection: orders
// customerId in customers collection
// productId in product collection
// collection (table) . document( record)
const Joi = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    max: 9999,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  coupon: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  customerPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  enRoute: {
    type: Boolean,
    required: true,
    default: false,
  },
  customerReceived: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    productId: Joi.objectId().required(),
    quantity: Joi.number().required().min(0).max(9999),
    price: Joi.number().required().min(0).max(1000),
    coupon: Joi.string().min(1).max(100),
  });

  return schema.validate(order);
}
exports.validate = validateOrder;
exports.Order = Order;
