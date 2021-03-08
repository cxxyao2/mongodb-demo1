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
    minlength: 3,
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
  status: {
    type: Number,
    required: true,
    min: 1,
    max: 2,
    default: 1,
  },
  closeType: {
    type: Number,
    min: 1,
    max: 3,
    default: 2,
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
  reasons: {
    type: String,
    maxlength: 1000,
    default:""
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

// required fields
function validateChannel(Channel) {
  const schema = Joi.object({
    _id:Joi.objectId(),
    name: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(5).max(200).required(),
    contactPerson: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    level: Joi.number().min(1).max(4).required(),
    status: Joi.number().min(1).max(2).required(),
    closeType:Joi.number(),
    responsible: Joi.objectId().required(),
    collaborator:Joi.objectId(),
    reasons:Joi.string().max(1000).allow(''),
  });
  return schema.validate(Channel);
}



   

// supplementary fields
function validateChannelId(obj) {
  const schema = Joi.object({
   _id:Joi.objectId()});
  return schema.validate(obj)
}

function validateCollaborator(obj) {
  const schema = Joi.object({
  collaborator:Joi.objectId()});
  return schema.validate(obj);
}


function validateReasons(obj) {
  const schema = Joi.object({
    reasons:Joi.string().max(1000).allow('')});
  return schema.validate(obj);
}



exports.validateId = validateChannelId;
exports.validateCollaborator = validateCollaborator;
exports.validateReasons = validateReasons;


exports.ChannelSchema = ChannelSchema;
exports.Channel = Channel;
exports.validate = validateChannel;
