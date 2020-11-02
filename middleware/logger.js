// customized middleware example
// 3 parameters =>  req, res, next
// next() is very important.
function log(req, res, next) {
  console.log("Logging...");
  next();
}

module.exports = log;