'use strict';

const express = require('express');
const router = express.Router();

// ---- activate passport later ----
// const passport = require('passport');

// ---- require passport/authentication later ---- 
// const {router: localStrategy, jwtStrategy} = require('../auth');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
// const jwtAuth = passport.authenticate('jwt', {session: false});

const {Category} = require('./models');
const {User} = require('../users/models');


// GET request for all categories
router.get('/', (req, res) => {
  Category.find()
    .populate('business')
    .then(categories => res.json(categories.map(category => category.serialize())))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'})
    });
});


// ---- Require jwtAuth later ----
// POST request to create a new business
router.post('/', (req, res) => {
  if (!('name' in req.body)) {
    const message = `Missing name in request body`;
    console.error(message);
    return res.status(400).send(message);
  };

  User.findById(req.body.user_id)
    .then(user => {
      if (user) {
        Category
          .create({
            user: req.body.user_id,
            name: req.body.name
          })
          .then(category => {
            category.save();
            res.status(201).json({
              id: category.id,
              name: category.name
            })
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Something went wrong'});
          });
      }
      else {
        const message = 'User not found';
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong'});
    });
});


// ---- Require jwtAuth later ----
// PUT request to update a business
router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({message: `ID's do not match`});
  }

  const toUpdate = {};
  const updateableFields = ['name'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Category
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});


// ---- Require jwtAuth later ----
// DELETE request to delete a category
router.delete('/:id', (req, res) => {
  Category
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
});

module.exports = {router};