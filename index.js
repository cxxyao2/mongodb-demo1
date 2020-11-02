const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const home = require('./routes/home');
const express = require("express");
const app = express();


mongoose.connect('mongodb://localhost/mongo-exercises',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => 
    console.log('MongoDB is connected...'))
  .catch(error => 
    console.error("Could not connect to Mongodb... ", error) );



app.set('view engine', 'pug');  //  pug: generate a html file with variables 
app.set('views','./views'); // default folder for views

app.use(express.json()); // use a middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));  // make a folder public
app.use(helmet());
app.use('/api/courses', courses);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies);

app.use('/', home);

//Configuration
console.log('Application name:' + config.get('name'));
console.log('Mail Server:' + config.get('mail.host'));
console.log('Mail Password:' + config.get('mail.password'));



// $export NODE_ENV=production
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...')
}

app.use(logger);


app.get('/', (req, res) => {
  // res.send('Hello World');
  res.render('index', { title: 'My Express App', message: 'Hello'});
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
