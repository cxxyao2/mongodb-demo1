const Joi = require("joi");
const mongoose = require("mongoose");

const stockareaSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
});

const Stockarea = mongoose.model("Stockarea", stockareaSchema);

function validateStockarea(stockarea) {
  const schema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
  });

  return schema.validate(stockarea);
}

exports.validate = validateStockarea;
exports.Stockarea = Stockarea;
