const express = require("express");
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const courses = require('../routes/courses');
const returns = require('../routes/returns');
const error = require('../middleware/error');


module.exports = function (app) {
    app.use(express.json()); // use a middlewares
    app.use('/api/courses', courses);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/movies', movies);
    app.use('/api/users', users);
    app.use('/api/returns', returns);
    app.use('/api/auth', auth);
    app.use(error);
  }