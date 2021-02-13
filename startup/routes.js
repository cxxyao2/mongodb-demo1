const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const courses = require("../routes/courses");
const returns = require("../routes/returns");
const files = require("../routes/files");
const itineraries = require("../routes/itineraries");
const orders = require("../routes/orders");
const products = require("../routes/products");
const categories = require("../routes/categories");
const stocks = require("../routes/stocks");
const stockareas = require("../routes/stockareas");

const error = require("../middleware/error");

module.exports = function (app) {
  app.use("/api/courses", courses);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rentals);
  app.use("/api/movies", movies);
  app.use("/api/users", users);
  app.use("/api/returns", returns);
  app.use("/api/itineraries", itineraries);
  app.use("/api/files", files);
  app.use("/api/orders", orders);
  app.use("/api/products", products);
  app.use("/api/categories", categories);
  app.use("/api/stocks", stocks);
  app.use("/api/stockareas", stockareas);
  app.use("/api/auth", auth);
  app.use(error);
};
