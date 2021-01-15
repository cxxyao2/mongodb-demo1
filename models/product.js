const Joi = require("joi");
const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  })
);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    categoryId: Joi.objectId().required(),
  });

  return schema.validate(product);
}

exports.validate = validateProduct;
exports.Product = Product;
