const Joi = require("joi");
const mongoose = require("mongoose");

const Itinerary = mongoose.model(
  "Itinerary",
  new mongoose.Schema({
    salesmanId: mongoose.Schema.Types.ObjectId,
    salesmanName: String,
    customerId: mongoose.Schema.Types.ObjectId,
    customerName: String,
    latitude: Number,
    longitude: Number,
    photoName: String,
    visitDate: {
      type: Date,
      default: Date.now,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  })
);

function validateItinerary(itinerary) {
  const schema = Joi.object({
    salesmanId: Joi.objectId().required(),
    photoName: Joi.string().required(),
    customerName: Joi.string().required(),
    latitude: Joi.number().min(0).required(),
    longitude: Joi.number().min(0).required(),
    visitDate: Joi.date(),
  });

  return schema.validate(itinerary);
}

exports.Itinerary = Itinerary;
exports.validate = validateItinerary;
