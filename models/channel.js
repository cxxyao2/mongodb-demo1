const Joi = require("joi");
const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 200,
  },
  contactPerson: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    default: 1,
  },
  closeReason: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
    default: 2,
  },
  reasonDetails: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const Channel = mongoose.model("Channel", ChannelSchema);

function validateChannel(Channel) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(5).max(200).required(),
    concatPerson: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    email: Joi.email().required(),
    level: Joi.number().min(1).max(4).required(),
    closeReason: Joi.number().min(1).max(3).required(),
    reasonDetails: Joi.string().min(5).max(50),
    responsible: Joi.objectId().required(),
    collaborator: Joi.objectId(),
    updateDate: Joi.date(),
  });

  return schema.validate(Channel);
}

exports.ChannelSchema = ChannelSchema;
exports.Channel = Channel;
exports.validate = validateChannel;
