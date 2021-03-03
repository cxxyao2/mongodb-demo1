const { Channel, validate } = require("../models/channel");
const { User } = require("../models/user");
const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();
const moment = require("moment");

router.get("/", async (req, res) => {
  const channels = await Channel.find().sort("name");
  res.send(channels);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const responsible = await User.findById(req.body.responsible);
  if (!responsible) return res.status(400).send("Invalid responsible.");

  let collaborator;
  if (req.body.collaborator) {
    collaborator = await User.findById(req.body.collaborator);
    if (!collaborator) return res.status(400).send("Invalid collaborator.");
  }

  const { name, address, contactPerson, phone, email, level } = req.body;
  const channel = new Channel({
    name,
    address,
    contactPerson,
    phone,
    email,
    level,
    responsible: responsible._id,
  });
  if (collaborator) {
    channel.collaborator = collaborator._id;
  }

  if (closeReason) {
    channel.closeReason = closeReason;
  }

  if (reasonDetails) {
    channel.reasonDetails = reasonDetails;
  }

  await channel.save();
  // TODO  保存到客户名单，第一次保存是临时客户


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
    closeReason,
    reasonDetails,
    responsible,
    collaborator,
  } = req.body;

  const updateDate = moment();
  const channel = await Channel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      address,
      contactPerson,
      phone,
      email,
      level,
      closeReason,
      reasonDetails,
      responsible,
      collaborator,
      updateDate,
    },
    {
      new: true,
    }
  );

  if (!channel)
    return res.status(404).send("The Channel with the given ID was not found.");

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
