const { Channel, validate,validateId,validateCollaborator,  validateReasons } = require("../models/channel");
const { User } = require("../models/user");
const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  let channels = undefined;

  let { name } = req.query;  // {title:/教/}.  $regex: name, $options: "$i"  name: /ALEX/,
  // const arr = await Movie.find({ year: { $gte: 1980, $lte: 1989 } });
  if (name) {
    channels = await Channel.find({ name:{ $regex: name, $options: "$i"}}).sort("-level").select("-createDate -updateDate  -__v");
  } else {
    channels = await Channel.find().sort("name").select("-createDate -updateDate -__v");
  }

  res.send(channels);
});

router.post("/", async (req, res) => {
  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const responsibleObj = await User.findById(req.body.responsible);
  if (!responsibleObj) return res.status(400).send("Invalid responsible.");

  let collaboratorObj;
  if (req.body.collaborator && req.body.collaborator.trim() !== "") {
    collaboratorObj = await User.findById(req.body.collaborator);
    if (!collaboratorObj) return res.status(400).send("Invalid collaborator.");
  }

  const {
    name,
    address,
    contactPerson,
    phone,
    email,
    level,
    status,
    closeType,
    reasons,
    responsible,
    collaborator,
  } = req.body;

  const channel = new Channel({
    name,
    address,
    contactPerson,
    phone,
    email,
    level,
    status,
    responsible,
  });
  if (collaborator) {
    channel.collaborator = collaborator;
  }

  if (closeType) {
    channel.closeType = closeType;
  }

  if (reasons) {
    channel.reasons = reasons;
  }

  await channel.save();
  res.send(channel);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    address,
    contactPerson,
    phone,
    email,
    level,
    status,
    closeType,
    reasons,
    responsible,
    collaborator,
  } = req.body;

  const channel = await Channel.findById(req.params.id);
  if (!channel) {
    return res.status(404).send("The Channel with the given ID was not found.");
  }

  channel.name = name;
  channel.address = address;
  channel.contactPerson = contactPerson;
  channel.phone = phone;
  channel.email = email;
  channel.level = level;
  channel.status = status;
  channel.responsible = responsible;
  channel.updateDate = new Date();

  if (closeType) {
    channel.closeType = closeType;
  }

    channel.reasons = reasons;


  if (collaborator) {
    channel.collaborator = collaborator;
  }
  await channel.save();
  res.send(channel);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const channel = await Channel.findByIdAndRemove(req.params.id);

  if (!channel)
    return res.status(404).send("The Channel with the given ID was not found.");

  res.send(channel);
});

router.get("/:id", async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel)
    return res.status(404).send("The Channel with the given ID was not found.");

  res.send(channel);
});

module.exports = router;
