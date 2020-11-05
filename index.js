
const winston = require('winston');
const express = require("express");
const app = express();

const mongoose = require('mongoose');
const config = require('config');
const db= config.get('db');
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => 
    winston.info(`Connected to ${db}...`));

const morgan = require('morgan');
// const helmet = require('helmet');
const logger = require('./middleware/logger');
require('./startup/logging')();
require('./startup/routes')(app);
//  require('./startup/db')();
require('./startup/config')();
require('./startup/validate')();




  //throw new Error('this is a new error 1020');
  // const p = Promise.reject(new Error('something !! happend!!!'));
  // p.then(() => console.log('promise,error'));


// const home = require('./routes/home');
// app.use(express.urlencoded({ extended: true}));
// app.use(express.static('public'));  // make a folder public
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
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...')
}

app.use(logger);


// app.get('/', (req, res) => {
//   // res.send('Hello World');
//   res.render('index', { title: 'My Express App', message: 'Hello'});
// });



const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
module.exports = server;