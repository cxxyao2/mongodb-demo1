const { Category, validate } = require("../models/category");
const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find().sort("name");
  res.send(categories);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category({
    name: req.body.name,
  });
  await category.save();
  res.send(category);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    id: req.body.id,
  });

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("The Category with the given ID was not found.");

  res.send(category);
});

router.get("/:id", async (req, res) => {
  let category = await Category.findById(req.params.id);
//let category = await Category.find({id: req.params.id}).select("id name -_id");

 
    if (!category){
       return res.status(404).send("The Movie with the given ID was not found.");
     }
   

   

  res.send(category);
});

module.exports = router;
