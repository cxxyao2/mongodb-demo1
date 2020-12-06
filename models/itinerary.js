const Joi = require('joi');
const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  customer: {
  type: new mongoose.Schema({
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
    minlength: 5,
    maxlength: 50
  } 
  }),
required: true
},
  salesman: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      title: {
        type: String,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      phone: {
        type: String,
        minlength: 5,
        maxlength: 50
      } 
    }),
    required: true
  },
  photoName: { 
        type: String,
        min: 0,
        max: 255
  },
  visitDate: { 
    type: Date, 
    default: Date.now
  },
  createdDate: { 
    type: Date,
    default: Date.now
  },
  updatedDate: { 
    type: Date,
    default: Date.now
  },
});


const Itinerary = mongoose.model('Itinerary',itinerarySchema);


function validateItinerary(itinerary) {
  const schema = Joi.object({
    salesmanId: Joi.objectId().required(),
    photoName:Joi.string().required(),
    customerName:Joi.string().required(),
    latitude: Joi.number().min(0).required(),
    longitude: Joi.number().min(0).required(),
    visitDate: Joi.date()
  });

  return schema.validate(itinerary);
}

exports.Itinerary = Itinerary; 
exports.validate = validateItinerary;