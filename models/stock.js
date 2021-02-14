// collection: stocks
// productId in products collection
// areaId in stock-areas collection
// collection (table) . document( record)
const Joi = require("joi");
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stockarea",
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
  expiredDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

function validateStock(stock) {
  const schema = Joi.object({
    areaId: Joi.objectId().required(),
    productId: Joi.objectId().required(),
    quantity: Joi.number().required().min(0).max(9999),
    expiredDate: Joi.date().required(),
  });

  return schema.validate(stock);
}
exports.validate = validateStock;
exports.Stock = Stock;
