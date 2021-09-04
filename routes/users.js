const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/:id", async (req, res) => {
   let user = await User.findOne({
    $or: [{ email: req.body.name }, { name: req.body.name }],
  }).select("name email");
 
  return res.send(user);
});


router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.send(user);
});


router.get("/", async (req, res) => {
  const users = await User.find().select(
    "_id name region"
  );
  res.send(users);
});




router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // let user = await User.findOne({ email: req.body.email });
   let user = await User.findOne({
    $or: [{ email: req.body.email }, { name: req.body.name }],
  });
  if (user) return res.status(400).send("User has already registered.");
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
// FOR ANGULAR .
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send( {"_id": user._id, "name":user.name, "email":user.email,"token":token});
});

  // FOR REACT
//   res
//     .header("x-auth-token", token)
//     .header("access-control-expose-headers", "x-auth-token")
//     .send(_.pick(user, ["_id", "name", "email"]));
// });

module.exports = router;
