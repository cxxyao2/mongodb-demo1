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
    visitStart: {
      type: Date,
      default: Date.now,
    },
     visitEnd: {
      type: Date,
      default: Date.now,
    },
    visitNote: {
    type: String,
    trim: true,
    minlength:10,
    maxlength:1000
  },
  activities:  [String],
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
    customerId:  Joi.objectId().required(),
    photoName: Joi.string(),
    latitude: Joi.number().min(0),
    longitude: Joi.number().min(0),
    visitStart: Joi.date(),
    visitEnd: Joi.date(),
    activities:Joi.array().min(1);
    visitNote: Joi.string().min(10).max(1000)
  });

  return schema.validate(itinerary);
}

exports.Itinerary = Itinerary;
exports.validate = validateItinerary;
