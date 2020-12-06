const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 100
  },
  latitude: {
    type: Number,
    required: true,
    default: 0
  },
  longitude: {
    type: Number,
    required: true,
    default: 0
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  } ,    
 isGold: {
    type: Boolean,
    default: false
  }});
const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean()
  });

  return schema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.Customer = Customer; 
exports.validate = validateCustomer;