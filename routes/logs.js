const { Log, validate } = require('../models/log');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const logs = await Log.find();
  res.send(logs);
});


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  
 const log = new Log({
   logDate: req.body.logDate,
   loginIP: req.body.loginIP,
   userName: req.body.userName,
   content: req.body.content,
   logType: req.body.logType,
 });
  await log.save();
  res.send(log);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let log = await Log.findById(req.params.id);
  if (!log)
    return res.status(404).send('The Log with the given ID was not found.');

  log = await Log.updateOne(
    { _id: req.params.id },
    {
      $set: {
        logDate: req.body.logDate,
        loginIP: req.body.loginIP,
        userName: req.body.userName,
        content: req.body.content,
        logType: req.body.logType,
      },
    }
  );

  res.send(log);
});

// router.delete("/:id", [auth, admin], async (req, res) => {
router.delete('/:id', async (req, res) => {
  const log = await Log.findByIdAndRemove(req.params.id);

  if (!log)
    return res.status(404).send('The Log with the given ID was not found.');

  res.send(log);
});

router.get('/:id', async (req, res) => {
  const log = await Log.findById(req.params.id);

  if (!log)
    return res.status(404).send('The Log with the given ID was not found.');

  res.send(log);
});

module.exports = router;
