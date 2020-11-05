const winston = require('winston');

module.exports = function(err,req,res,next) {
  winston.error(err.message, err);
  res.status(500).send('Something failed');
}

// method1, winston.log
// module.exports = function(err,req,res,next) {
//   // Log the exception
//   // level, message
//   winston.log('error', err.message);
//   // error
//   // warn
//   // info
//   // verbose
//   // debug
//   // silly 
//   res.status(500).send('Something failed');
// };
