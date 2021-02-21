// collection: stocks
// productId in products collection
// areaId in stock-areas collection
// collection (table) . document( record)
const Joi = require("joi");
const mongoose = require("mongoose");

const resetPwdTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 300,
  },
  isExpired: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0,
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expireDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ResetPwdToken = mongoose.model("ResetPwdToken", resetPwdTokenSchema);

function validateToken(token) {
  const schema = Joi.object({
    token: Joi.string().min(10).max(300).required(),
  });

  return schema.validate(token);
}
exports.validateToken = validateToken;
exports.ResetPwdToken = ResetPwdToken;
