const winston = require("winston"); // logger everything
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser"); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require("cors");
const morgan = require("morgan");
const config = require("config");

const logger = require("./middleware/logger");

const app = express();
app.use(cors());
app.use(express.static("public")); // make a folder public

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validate")();
require("./startup/prod")(app);

//throw new Error('this is a new error 1020');
// const p = Promise.reject(new Error('something !! happend!!!'));
// p.then(() => console.log('promise,error'));

// const home = require('./routes/home');

// app.use(helmet());
// app.set('view engine', 'pug');  //  pug: generate a html file with variables
// app.set('views','./views'); // default folder for views

// app.use(function(err,req,res,next) {
//   // Log the exception
//   res.status(500).send('Something failed');
// });
// app.use('/', home);

//Configuration
// console.log('Application name:' + config.get('name'));
// console.log('Mail Server:' + config.get('mail.host'));
// console.log('Mail Password:' + config.get('mail.password'));

// $export NODE_ENV=production
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

app.use(logger);

// app.get('/', (req, res) => {
//   // res.send('Hello World');
//   res.render('index', { title: 'My Express App', message: 'Hello'});
// });

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);
module.exports = server;
