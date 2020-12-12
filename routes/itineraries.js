const Fawn = require("fawn");
// Fawn.init(mongoose);
const express = require("express");
const router = express.Router();

const { Itinerary, validate } = require("../models/itinerary");
const { User } = require("../models/user"); // salesman must be a valid user
const { Customer } = require("../models/customer");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { convertStringToDate } = require("../utils/format_convert");

router.get("/", async (req, res) => {
  let itineraries = {};
  if (!req.query.fromdate) {
    itineraries = await Itinerary.find().sort("visitDate");
    return res.send(itineraries);
  }

  let fromDate = req.query.fromdate;
  let toDate = req.query.todate;
  let salesmanName = req.query.salesman;
  let data = {};

  // formDate, toDate, format: yyyyMMdd
  const startYYMMDD = convertStringToDate(fromDate, 0, 0, 0);
  const endYYMMDD = convertStringToDate(toDate, 23, 59, 59);

  await Itinerary.aggregate(
    [
      {
        $match: {
          salesmanName: salesmanName,
          visitDate: { $gte: startYYMMDD, $lte: endYYMMDD },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerName",
          foreignField: "name",
          as: "customers",
        },
      },
      {
        $unwind: {
          path: "$customers",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $addFields: { visitFlag: 1 } },
      {
        $project: {
          _id: 1,
          salesmanName: 1,
          "customers.name": 1,
          "customers.region": 1,
          visitDate: 1,
          visitFlag: 1,
        },
      },
      {
        $group: {
          _id: {
            salesmanName: "$salesmanName",
            customerName: "$customers.name",
            customerRegin: "$customers.region",
            month: { $month: "$visitDate" },
            year: { $year: "$visitDate" },
          },
          visitNum: { $sum: "$visitFlag" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
    (err, docs) => {
      if (err) {
        console.log("err is ", err);
        return;
      }
      data.byCustomerNameDate = docs;
      // console.log(data);
    }
  );

  await Itinerary.aggregate(
    [
      {
        $match: {
          salesmanName: salesmanName,
          visitDate: { $gte: startYYMMDD, $lte: endYYMMDD },
        },
      },
      { $addFields: { visitFlag: 1 } },
      {
        $project: {
          salesmanName: 1,
          "customers.name": 1,
          "customers.region": 1,
          visitDate: 1,
          latitude: 1,
          longitude: 1,
          visitFlag: 1,
        },
      },
      {
        $group: {
          _id: {
            salesmanName: "$salesmanName",
            month: { $month: "$visitDate" },
            year: { $year: "$visitDate" },
            latitude: "$latitude",
            longitude: "$longitude",
          },
          visitNum: { $sum: "$visitFlag" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
    (err, docs) => {
      if (err) {
        console.log("err is ", err);
        return;
      }
      data.byLocationNameDate = docs;
      // console.log(data);
    }
  );

  return res.send(data);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let {
    salesmanId,
    customerName,
    photoName,
    latitude,
    longitude,
    visitDate,
  } = req.body;

  const salesman = await User.findById(salesmanId);
  if (!salesman) return res.status(400).send("Invalid salesman.");

  const customerOld = await Customer.findOne({ name: customerName });
  const customerId = customerOld ? customerOld._id : null;

  let itinerary = new Itinerary({
    salesmanId: salesmanId,
    salesmanName: salesman.name,
    customerId: customerId,
    customerName: customerName,
    latitude: latitude,
    longitude: longitude,
    photoName: photoName,
    visitDate: visitDate,
    createdDate: new Date(),
    updatedDate: new Date(),
  });

  if (!customerOld) {
    itinerary = await itinerary.save();
    res.send(itinerary);
  } else {
    try {
      new Fawn.Task()
        .save("itineraries", itinerary)
        .update(
          "customers",
          { _id: customerId },
          {
            longitude: longitude,
            latitude: latitude,
          }
        )
        .run();
      res.send(itinerary);
    } catch (ex) {
      console.log("error is ", ex);
      res.status(500).send("Something failed.");
    }
  }
});

router.get("/:id", async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary)
    return res
      .status(404)
      .send("The Itinerary with the given ID was not found.");
  res.send(itinerary);
});

router.put("/:id", async (req, res) => {
  // salesmanId:  photoName: customerName: latitude: longitude:
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let {
    salesmanId,
    customerName,
    photoName,
    latitude,
    longitude,
    visitDate,
  } = req.body;

  let itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary)
    return res
      .status(404)
      .send("The itinerary with the given ID was not found.");
  const salesman = await User.findById(salesmanId);
  if (!salesman) return res.status(400).send("Invalid salesman.");

  const customer = itinerary.customer;
  if (!customer)
    return res.status(404).send("The itinerary without a valid customer.");
  itinerary.latitude = latitude;
  itinerary.longitude = longitude;
  itinerary.customerName = customerName;
  if (visitDate) itinerary.visitDate = visitDate;
  itinerary.photoName = photoName;
  itinerary = await itinerary.save({});
  res.send(itinerary);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const itinerary = await Movie.findByIdAndRemove(req.params.id);

  if (!itinerary)
    return res
      .status(404)
      .send("The itinerary with the given ID was not found.");

  res.send(itinerary);
});
module.exports = router;
