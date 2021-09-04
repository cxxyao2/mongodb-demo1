// collection: logs
// logDate: Date;
// loginIP: string;
// userName: string;
// content: string;
// logType: string; // E -error O - operation

const Joi = require('joi');
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  logDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  loginIP: {
    type: String,
    required: true,
    default: '255.255.255.255',
  },
  userName: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    require: true,
    trim: true,
  },
  logType: {
    type: String,
    require: true,
  },
});

const Log = mongoose.model('Log', logSchema);

function validateLog(log) {
  const schema = Joi.object({
    logDate: Joi.date().required(),
    loginIP: Joi.string().required(),
    userName: Joi.string().required(),
    content: Joi.string().required(),
    logType: Joi.string().required(),
  });

  return schema.validate(log);
}
exports.validate = validateLog;
exports.Log = Log;
