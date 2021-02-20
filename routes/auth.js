const Joi = require("joi");
const config = require("config");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { ResetPwdToken, validate } = require("../models/resetPwdToken");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { sendResetPwdEmail } = require("../startup/email.js");

router.post("/", async (req, res) => {
  const lockedMessage =
    "Your account has been locked.Please contact the administrator.";
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    let { failedCount } = user;
    failedCount += 1;
    user.failedCount = failedCount;
    if (failedCount >= Number(config.get("pwdTryMax"))) {
      user.validity = 0;
    }
    await user.save();
    return res.status(400).send("Invalid email or password.");
  }

  // email and password are correct.but account is locked.
  if (user.validity === 0) return res.status(400).send(lockedMessage);

  const token = user.generateAuthToken();
  res.send(token);
});

// update password
router.put("/", async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.newPassword, salt);
  await user.save();

  res.send(user);
});

// send reset password Email
router.post("/email/resetpassword", async (req, res) => {
  const email = req.query.email;
  const token = jwt.sign({ email: email }, config.get("jwtPrivateKey"));
  let url = `http://localhost:5000/password/reset?token=${token}`;
  try {
    const tokenRecord = new ResetPwdToken();
    tokenRecord.token = token;
    await tokenRecord.save();
    await sendResetPwdEmail(url);
    return res.status(200).send("A reset password email has been sent.");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// reset password by token. ResetPwdToken
// http://xx.xxx.xx.xxx/password/reset?token=xxxxx
router.post("/password/reset", async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Invalid token.");

  let tokenRecord = await ResetPwdToken.findOne({ token: token });
  if (!tokenRecord) return res.status(400).send("Invalid Token.");

  let now = new Date();
  if (now > tokenRecord.expireDate || tokenRecord.isExpired === 1)
    return res.status(400).send("Token expired.");

  var decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  console.log(decoded.payload);
  let email = decoded.payload.email;
  let user = await User.findOne({ email: email });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.newPassword, salt);
  user.validity = 1; // 0 invalid,locked; 1,valid
  user.failedCount = 0; // reset failedCount; >=3, account will be locked
  await user.save();

  tokenRecord.isExpired = 1;
  await tokenRecord.save();

  const token = user.generateAuthToken();
  res.status(200).send("Password is reset successfully.");
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

function validateUpdate(req) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    newPassword: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
