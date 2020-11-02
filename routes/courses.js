const express = require('express');
const router = express.Router();
const Joi = require("joi");

const courses = [
  {id: '1', name: "python"},
  {id: '2', name: "JS"},
  {id: '3', name: "es2005"},
];


router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) res.status(404).send('The course with this id is not found');
  res.send(course);
});

router.post('/', (req, res) => {
  const { error } = validateCourse(req.body.name);
  if (error) {
     return res.status(400).send(error.details[0].message);
   
  }
  const course = {
    id: String(courses.length + 1) ,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

router.put('/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if(!course) return res.status(404).send('not found id');

  const { error }= validateCourse(req.body.name);
  if (error) {
    return res.status(400).send(error.details[0].message);
    
  }
  
  course.name = req.body.name;
  res.send(course);

});

router.delete('/:id', (req,res) => {
  const course = courses.find(c => c.id === req.params.id);
  if(!course) return res.status(404).send('not found id');

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);


});

function validateCourse(course) {
    const schema = Joi.string().min(3).required();
    return schema.validate(course);
}

module.exports = router;