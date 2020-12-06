const mongoose = require('mongoose'); 
const Fawn = require('fawn');
// Fawn.init(mongoose);
const express = require('express');
const router = express.Router();

const {Itinerary, validate} = require('../models/itinerary'); 
const {User} = require('../models/user'); // salesman must be a valid user
const {Customer} = require('../models/customer'); 
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");


router.get('/', async (req, res) => {
  const itineraries = await Itinerary.find().sort('visitDate');
  res.send(itineraries);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let {
    salesmanId, 
    customerName,
    photoName,
    latitude,
    longitude,
    visitDate
    } = req.body;


  const salesman = await User.findById(salesmanId);
  if (!salesman) return res.status(400).send('Invalid salesman.');

  const customerOld = await Customer.findOne({ name: customerName });
  const customerId = customerOld ? {_id: customerOld._id}: {}; 
  customer = { ...customerId,
    name: customerName,
    latitude: latitude,
    longitude: longitude
  };
   
  let itinerary = new Itinerary({ 
    customer: {...customer},
    salesman: {
      _id: salesman._id,
      name: salesman.name
    },
    photoName: photoName,
    visitDate: visitDate,
    createdDate: new Date(),
    updatedDate: new Date()
  });

  if(!customerOld) {
    itinerary = await itinerary.save();
    res.send(itinerary);
  } else {
    try {
      new Fawn.Task()
        .save('itineraries', itinerary)
        .update('customers', { _id: customer._id }, {
          longitude: customer.longitude,
          latitude: customer.latitude
        })
        .run();
      res.send(itinerary);
    } catch (ex) {
      console.log('error is ', ex)
      res.status(500).send('Something failed.');
    }
  }
});

router.get('/:id', async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) return res.status(404).send('The Itinerary with the given ID was not found.');
  res.send(itinerary);
});


router.put('/:id', async (req, res) => {
  // salesmanId:  photoName: customerName: latitude: longitude: 
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
   let {
    salesmanId, 
    customerName,
    photoName,
    latitude,
    longitude,
    visitDate
    } = req.body;

  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) return res.status(404).send('The itinerary with the given ID was not found.');
  const customer = itinerary.customer;
  if(!customer) return res.status(404).send('The itinerary withoud a valid customer.');
  itinerary.customer.latitude = latitude;
  itinerary.customer.longitude = longitude;
  itinerary.customer.name = customerName;
  if (visitDate) itinerary.visitDate= visitDate;  

  

  itinerary.photoName = photoName;
  const updated = await itinerary.save();
  res.send(itinerary);
});

router.delete('/:id', [auth,admin],async (req, res) => {
  const itinerary = await Movie.findByIdAndRemove(req.params.id);

  if (!itinerary) return res.status(404).send('The itinerary with the given ID was not found.');

  res.send(itinerary);
});
module.exports = router; 