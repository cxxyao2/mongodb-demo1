const Fawn = require("fawn");
// Fawn.init(mongoose);
const express = require("express");
const router = express.Router();
const  moment = require(“moment”);

const { Itinerary, validate } = require("../models/itinerary");
const { User } = require("../models/user"); // salesman must be a valid user
const { Customer } = require("../models/customer");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { convertStringToDate } = require("../utils/format_convert");

// xxxx.xxxx.xxxx.xxx:xxx/itineriers/report?fromdata=yyyymmdd&&todate=yyyymmdd
router.get("/report", async (req, res) => {
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
            customerRegion: "$customers.region",
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
      let result = [];
      docs.map((doc) => {
        const {
          salesmanName,
          customerName,
          customerRegion,
          month,
          year,
        } = doc._id;
        result.push({
          salesmanName: salesmanName,
          month: month,
          year: year,
          customerName: customerName,
          customerRegion: customerRegion,
          count: doc.visitNum,
        });
      });
      console.log("result is ", result);
      data.byCustomerNameDate = result;
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
      let result = [];
      docs.map((doc) => {
        const { salesmanName, month, year, latitude, longitude } = doc._id;
        result.push({
          salesmanName: salesmanName,
          month: month,
          year: year,
          latitude: latitude,
          longitude: longitude,
          count: doc.visitNum,
        });
      });

      data.byLocationNameDate = result;
    }
  );

  return res.send(data);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let {
    salesmanId,
    customerId,
    photoName,
    latitude,
    longitude,
    visitDate,
    activities,
    visitNote,
  } = req.body;

  const salesman = await User.findById(salesmanId);
  if (!salesman) return res.status(400).send("Invalid salesman.");

  const customerOld = await Customer.findById(customerId);
  if (!customerOld) return res.status(400).send("Invalid customer.");

  let itinerary = undefined;
  const startDate =convertStringToDate(moment(visitDate).format("YYYY-MM-DD"),0,0,0);
  const endDate = startDate.add(1,'days');
  itinerary = await Itinerary.findOne({
    salesmanId: salesmanId,
    customerId: customerId,
    visitDate: { $gte: startDate, $lt: endDate },
  });
  if (itinerary) {
    // visitDate 不许更新,只能创建一次
    if (latitude) {
      itinerary.latitude = latitude;
    }
    if (longitude) {
      itinerary.longitude = longitude;
    }
    if (customer) {
      itinerary.customerName = customer.name;
    }
    if (photoName) {
      itinerary.photoName = photoName;
    }
    if (visitNote) {
      itinerary.visitNote = visitNote;
    }
    if (activities) {
      itinerary.activities = activities;
    }
  } else {
    itinerary = new Itinerary({
      salesmanId,
      salesmanName: salesman.name,
      customerId,
      customerName: customerOld.name,
      latitude,
      longitude,
      photoName,
      visitDate,
      visitNote,
      activities,
      createdDate: new Date(),
      updatedDate: new Date(),
    });
  }

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
    customerId,
    photoName,
    latitude,
    longitude,
    visitNote,
    activities,
  } = req.body;

  let itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary)
    return res
      .status(404)
      .send("The itinerary with the given ID was not found.");
  const salesman = await User.findById(salesmanId);
  if (!salesman) return res.status(400).send("Invalid salesman.");

  const customer = await Customer.findById(customerId);
  if (!customer)
    return res.status(404).send("The itinerary without a valid customer.");

  if (latitude) {
    itinerary.latitude = latitude;
  }
  if (longitude) {
    itinerary.longitude = longitude;
  }
  if (customer) {
    itinerary.customerName = customer.name;
  }

  if (photoName) {
    itinerary.photoName = photoName;
  }
  if (visitNote) {
    itinerary.visitNote = visitNote;
  }
  if (activities) {
    itenerary.activities = activities;
  }

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
