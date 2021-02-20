const { Channel, validate } = require("../models/channel");
const { User } = require("../models/user");
const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const Channels = await Channel.find().sort("name");
  res.send(Channels);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const responsible = await User.findById(req.body.responsible);
  if (!responsible) return res.status(400).send("Invalid responsible.");

  if (req.body.collaborator) {
    const collaborator = await User.findById(req.body.collaborator);
    if (!collaborator) return res.status(400).send("Invalid collaborator.");
  }

  const {
    name,
    address,
    concatPerson,
    phone,
    email,
    level,
    closeReason,
    reasonDetails,
  } = req.body;
  const Channel = new Channel({
    name,
    address,
    concatPerson,
    phone,
    email,
    level,
    closeReason,
    reasonDetails,
    responsible,
    collaborator,
  });
  await Channel.save();
  res.send(Channel);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    address,
    concatPerson,
    phone,
    email,
    level,
    closeReason,
    reasonDetails,
    updateDate,
  } = req.body;

  const Channel = await Channel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      address,
      concatPerson,
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

  if (!Channel)
    return res.status(404).send("The Channel with the given ID was not found.");

  res.send(Channel);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const Channel = await Channel.findByIdAndRemove(req.params.id);

  if (!Channel)
    return res.status(404).send("The Channel with the given ID was not found.");

  res.send(Channel);
});

router.get("/:id", async (req, res) => {
  const Channel = await Channel.findById(req.params.id);

  if (!Channel)
    return res.status(404).send("The Channel with the given ID was not found.");

  res.send(Channel);
});

module.exports = router;
